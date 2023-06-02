const Todo = require('./../models/todoModel');
const catchAsync = require('./../utils/catchAsync');
const factory = require('./handlerFactory');
const AppError = require('./../utils/appError');
const User = require('./authController');

exports.aliasTopTodos = (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = 'name';
  req.query.fields = 'name,description';
  next();
};

exports.aliasMyTodos = (req, res, next) => {
  req.query.limit = '3';
  req.query.sort = 'name';
  req.query.fields = 'name,description';
  next();
};

exports.createTodos = (req, res, next) => {
  req.body.createdBy = req.user.id;
  next();
};

exports.getAllTodos = factory.getAll(Todo);
exports.getTodo = factory.getOne(Todo);
exports.createTodo = factory.createOne(Todo);
exports.updateTodo = factory.updateOne(Todo);
exports.deleteTodo = factory.deleteOne(Todo);

exports.getMyTodos = catchAsync(async (req, res, next) => {
  const todos = await Todo.find({
    guides: { _id: req.user.id }
  });

  res.status(200).json({
    status: 'success',
    results: todos.length,
    data: {
      data: todos
    }
  });
});

exports.getUser = factory.getOne(User);

exports.getGuideTodos = catchAsync(async (req, res, next) => {
  if (!req.params.id) {
    next(new AppError('Please provide the guide Id.', 400));
  }

  const todos = await Todo.find({
    guides: { _id: req.params.id }
  });

  res.status(200).json({
    status: 'success',
    results: todos.length,
    data: {
      data: todos
    }
  });
});

// /todos-within/:distance/center/:latlng/unit/:unit
// /todos-within/233/center/34.111745,-118.113491/unit/km
exports.getTodosWithin = catchAsync(async (req, res, next) => {
  const { distance, latlng, unit } = req.params;
  const [lat, lng] = latlng.split(',');

  const radius = unit === 'mi' ? distance / 3963.2 : distance / 6378.1;

  if (!lat || !lng) {
    next(
      new AppError(
        'Please provide latitutr and longitude in the format lat,lng.',
        400
      )
    );
  }

  const todos = await Todo.find({
    startLocation: { $geoWithin: { $centerSphere: [[lng, lat], radius] } }
  });

  res.status(200).json({
    status: 'success',
    results: todos.length,
    data: {
      data: todos
    }
  });
});

exports.getDistances = catchAsync(async (req, res, next) => {
  const { latlng, unit } = req.params;
  const [lat, lng] = latlng.split(',');

  const multiplier = unit === 'mi' ? 0.000621371 : 0.001;

  if (!lat || !lng) {
    next(
      new AppError(
        'Please provide latitutr and longitude in the format lat,lng.',
        400
      )
    );
  }

  const distances = await Todo.aggregate([
    {
      $geoNear: {
        near: {
          type: 'Point',
          coordinates: [lng * 1, lat * 1]
        },
        distanceField: 'distance',
        distanceMultiplier: multiplier
      }
    },
    {
      $project: {
        distance: 1,
        name: 1
      }
    }
  ]);

  res.status(200).json({
    status: 'success',
    data: {
      data: distances
    }
  });
});
