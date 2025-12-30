const express = require('express');
const router = express.Router();
const {
  filterEligibleStudents,
  getAllStudents,
  testDatabaseFields
} = require('../controllers/studentController');

// TEST ENDPOINT - Check database fields
router.get('/test-fields', testDatabaseFields);

// Get all students (limited)
router.get('/all', getAllStudents);

// Filter eligible students
router.post('/filter-eligible', filterEligibleStudents);

module.exports = router;
