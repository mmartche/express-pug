const express = require('express');
const userController = require('./../controllers/userController');
const todoController = require('./../controllers/todoController');
const authController = require('./../controllers/authController');

const router = express.Router();

router
  .route('/me')
  .get(
    authController.protect,
    todoController.aliasMyTodos,
    todoController.getMyTodos
  );

router
  .route('/guide/:id')
  .get(authController.protect, todoController.getGuideTodos);

router
  .route('/top-5')
  .get(todoController.aliasTopTodos, todoController.getAllTodos);

router
  .route('/todos-within/:distance/center/:latlng/unit/:unit')
  .get(todoController.getTodosWithin);

router.route('/distances/:latlng/unit/:unit').get(todoController.getDistances);

router
  .route('/')
  .get(todoController.getAllTodos)
  .post(
    authController.protect,
    authController.restrictTo('admin', 'guide'),
    todoController.createTodo
  );

router
  .route('/:id')
  .get(todoController.getTodo)
  .patch(
    authController.protect,
    authController.restrictTo('admin', 'guide'),
    todoController.updateTodo
  )
  .delete(
    authController.protect,
    authController.restrictTo('admin', 'guide'),
    todoController.deleteTodo
  );

module.exports = router;
