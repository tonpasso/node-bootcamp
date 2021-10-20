const express = require('express');
const tourController = require('./../controller/tourController');
const authController = require('./../controller/authController');

const router = express.Router();
// router.param('id', tourController.checkId);

router
  .route('/top-5-cheap')
  .get(tourController.aliasTopTours, tourController.getAllTours);

router
  .route('/tour-stats')
  .get(tourController.getTourStats);

router
  .route('/monthly-plan/:year')
  .get(tourController.monthlyPlanTours);

router
.route('/')
.get(authController.protect, tourController.getAllTours)
.post(tourController.createTour);

router
.route('/:id')
.get(tourController.findTourById)
.patch(tourController.updateTour)
.delete(tourController.excludeTour);

module.exports = router;
