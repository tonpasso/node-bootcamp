const express = require('express');
const userController = require('./../controller/userController');

const router = express.Router();


router
 .route('/')
 .get(userController.getAllUsers)
 .post(userController.createUser);

router
 .route('/:id')
 .get(userController.findUserById)
 .patch(userController.updateUser)
 .delete(userController.excludeUser);

module.exports = router;