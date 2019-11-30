const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appErr');
const APIFeatures = require('./../utils/apiFeature');

exports.deleteOne = Model => catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndDelete(req.params.id);

    if (!doc) {
        return next(new AppError('No document found with that ID', 404))
    }

    res.status(204).json({
        status: 'succes',
        data: {
            tour: "Delete tour finish"
        }
    })
})

exports.updateOne = Model => catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });

    if (!doc) {
        return next(new AppError('No document found with that ID', 404))
    }

    res.status(200).json({
        status: 'succes',
        data: {
            doc
        }
    })
});

exports.createOne = Model => catchAsync(async (req, res, next) => {
    const doc = await Model.create(req.body);

    res.status(201).json({
        status: 'succes',
        data: {
            doc
        }
    });
});

exports.getOne = (Model, popOption) => catchAsync(async (req, res, next) => {
    let query = Model.findById(req.params.id);

    if (popOption) query = query.populate(popOption)

    const doc = await query;

    if (!doc) {
        return next(new AppError('No document found with that ID', 404))
    }

    res.status(200).json({
        status: 'success',
        data: {
            doc
        }
    })
});

exports.getAll = Model => catchAsync(async (req, res, next) => {
    //To allow for nested GET review on Tour (hack)
    let filter = {};
    if (req.params.tourId) filter = { tour: req.params.tourId };

    const features = new APIFeatures(Model.find(filter), req.query).filter().sort().limitFields().paginate();

    //const doc = await features.query.explain();
    const doc = await features.query;

    res.status(200).json({
        status: 'succes',
        result: doc.length,
        data: {
            doc
        }
    })
});