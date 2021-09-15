const fs = require("fs");

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
);

const getAllTours = (req, res) => {
  res.status(200).json({
    status: "Success",
    results: tours.length,
    data: {
      tours,
    },
  });
};

const findTourById = (req, res) => {
  const { id } = req.params;

  const tour = tours.find((data) => data.id === Number(id));

  if (!tour)
    return res.status(404).json({
      status: "error",
      message: "Tour not found",
    });

  res.status(200).json({
    status: "success",
    tour,
  });
};

const createTour = (req, res) => {
  const newId = tours[tours.length - 1].id + 1;
  const newTour = Object.assign({ id: newId }, req.body);

  tours.push(newTour);
  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    (err) => {
      res.status(201).json({
        status: "success",
        data: {
          tour: newTour,
        },
      });
    }
  );
};

const updateTour = (req, res) => {
  if (req.params.id * 1 > tour.length) {
    returnres.status(404).json({
      status: "fails",
      message: "invalid ID",
    });
  }
  res.status(200).json({
    status: "success",
    data: {
      tour: "Updated tour here",
    },
  });
};

const excludeTour = (req, res) => {
  if (req.params.id * 1 > tour.length) {
    returnres.status(404).json({
      status: "fails",
      message: "invalid ID",
    });
  }
  res.status(204).json({
    status: "success",
    data: null,
  });
};

module.exports = {
  getAllTours,
  findTourById,
  createTour,
  updateTour,
  excludeTour,
};