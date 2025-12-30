const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  rollNumber: { type: String, required: true },
  studentName: { type: String, required: true },
  gender: { type: String, required: true },
  dateOfBirth: { type: Date, required: true },
  sscPercentage: { type: Number, required: true },
  interPercentage: { type: Number, required: true },
  btechPercentage: { type: Number, required: true },
  personalEmail: { type: String, required: true },
  domainEmail: { type: String, required: true },
  contactNumber: { type: String, required: true },
  backlogCount: { type: Number, default: 0 }
}, {
  collection: 'students'
});

module.exports = mongoose.model('Student', studentSchema, 'students');