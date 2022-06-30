const Zoo = require('../models/zoo');
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({ accessToken: mapBoxToken });
const { cloudinary } = require("../cloudinary");


module.exports.index = async(req, res) => {
    const zoos = await Zoo.find({}).populate('popupText');
    res.render('zoos/index', { zoos })
}

module.exports.renderNewForm = (req, res) => {
    res.render('zoos/new');
}

module.exports.createZoo = async(req, res, next) => {
    const geoData = await geocoder.forwardGeocode({
        query: req.body.zoo.location,
        limit: 1
    }).send()
    const zoo = new Zoo(req.body.zoo);
    zoo.geometry = geoData.body.features[0].geometry;
    zoo.images = req.files.map(f => ({ url: f.path, filename: f.filename }));
    zoo.author = req.user._id;
    await zoo.save();
    console.log(zoo);
    req.flash('success', 'Successfully added a new zoo!');
    res.redirect(`/zoos/${zoo._id}`)
}

module.exports.showZoo = async(req, res, ) => {
    const zoo = await Zoo.findById(req.params.id).populate({
        path: 'reviews',
        populate: {
            path: 'author'
        }
    }).populate('author');
    if (!zoo) {
        req.flash('error', 'Cannot find that zoo!');
        return res.redirect('/zoos');
    }
    res.render('zoos/show', { zoo });
}

module.exports.renderEditForm = async(req, res) => {
    const { id } = req.params;
    const zoo = await Zoo.findById(id)
    if (!zoo) {
        req.flash('error', 'Cannot find that zoo!');
        return res.redirect('/zoos');
    }
    res.render('zoos/edit', { zoo });
}

module.exports.updateZoo = async(req, res) => {
    const { id } = req.params;
    console.log(req.body);
    const zoo = await Zoo.findByIdAndUpdate(id, {...req.body.zoo });
    const imgs = req.files.map(f => ({ url: f.path, filename: f.filename }));
    zoo.images.push(...imgs);
    await zoo.save();
    if (req.body.deleteImages) {
        for (let filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename);
        }
        await zoo.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages } } } })
    }
    req.flash('success', 'Successfully updated zoo!');
    res.redirect(`/zoos/${zoo._id}`)
}

module.exports.deleteZoo = async(req, res) => {
    const { id } = req.params;
    await Zoo.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted zoo')
    res.redirect('/zoos');
}