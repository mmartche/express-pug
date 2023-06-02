const Todo = require('../models/todoModel');
const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.getOverview = catchAsync(async (req, res, next) => {
  // 1) Get todo data from collection
  const todos = await Todo.find();

  // 2) Build template
  // 3) Render that template using todo data from 1)
  res.status(200).render('overview', {
    title: 'All To Dos',
    todos
  });
});

exports.getTodo = catchAsync(async (req, res, next) => {
  // 1) Get the data, for the requested todo (including reviews and guides)
  const todo = await Todo.findOne({ slug: req.params.slug });

  if (!todo) {
    return next(new AppError('There is no todo with that name.', 404));
  }

  // 2) Build template
  // 3) Render template using data from 1)
  res.status(200).render('todo', {
    title: `${todo.name} To Do`,
    todo
  });
});

exports.getLoginForm = (req, res) => {
  res.status(200).render('login', {
    title: 'Log into your account'
  });
};

exports.getSiginForm = (req, res) => {
  res.status(200).render('sigin', {
    title: 'Create your account'
  });
};

exports.getAccount = (req, res) => {
  res.status(200).render('account', {
    title: 'Your account'
  });
};

exports.updateUserData = catchAsync(async (req, res, next) => {
  const updatedUser = await User.findByIdAndUpdate(
    req.user.id,
    {
      name: req.body.name,
      email: req.body.email
    },
    {
      new: true,
      runValidators: true
    }
  );

  res.status(200).render('account', {
    title: 'Your account',
    user: updatedUser
  });
});
