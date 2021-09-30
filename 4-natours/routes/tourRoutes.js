const express = require('express');
const tourController = require('./../controller/tourController');

const router = express.Router();
// router.param('id', tourController.checkId);

router
.route('/')
.get(tourController.getAllTours)
.post(tourController.createTour);

router
.route('/:id')
.get(tourController.findTourById)
.patch(tourController.updateTour)
.delete(tourController.excludeTour);

module.exports = router;
