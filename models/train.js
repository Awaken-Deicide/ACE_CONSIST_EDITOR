const mongoose = require('mongoose');

const trainSchema = new mongoose.Schema({
  trainNo: String,
  returningTrainNo: String,
  loco1: String,
  loco2: String,
  car1: String,
  car2: String,
  car3: String,
  car4: String,
  car5: String,
  car6: String,
  car7: String,
  car8: String,
  from_date: String, // Add fields for dates
  to_date: String,
});

module.exports = mongoose.model('Train', trainSchema);
