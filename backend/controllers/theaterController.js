// controllers/theaterController.js

import Theater from "../models/Theater.js";

// Create a new theater
export const createTheater = async (req, res) => {
  try {
    const { name, location, seats } = req.body;

    const newTheater = new Theater({ name, location, seats });
    await newTheater.save();

    res.status(201).json({
      message: 'Theater created successfully',
      theater: newTheater,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error creating theater', error });
  }
};

// Get all theaters
export const getAllTheaters = async (req, res) => {
  try {
    const theaters = await Theater.find();
    res.status(200).json(theaters);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching theaters', error });
  }
};
