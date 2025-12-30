const Student = require('../models/Student');
const mongoose = require('mongoose'); // ADD THIS LINE

// Test endpoint to verify connection
const testDatabaseFields = async (req, res) => {
  try {
    // Check if connected
    if (mongoose.connection.readyState !== 1) {
      return res.status(500).json({
        success: false,
        message: 'Database not connected',
        readyState: mongoose.connection.readyState
      });
    }

    // Get collections
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('Available collections:', collections.map(c => c.name));
    
    // Count students
    const count = await Student.countDocuments({});
    console.log('Total students count:', count);
    
    const sampleStudent = await Student.findOne({});
    
    if (!sampleStudent) {
      return res.status(404).json({
        success: false,
        message: 'No students found in collection',
        availableCollections: collections.map(c => c.name),
        modelCollection: Student.collection.name,
        totalCount: count,
        database: mongoose.connection.name
      });
    }

    res.status(200).json({
      success: true,
      message: 'Sample student data',
      database: mongoose.connection.name,
      modelCollection: Student.collection.name,
      totalStudents: count,
      fields: Object.keys(sampleStudent.toObject()),
      sampleData: sampleStudent.toObject()
    });
  } catch (error) {
    console.error('Error testing fields:', error);
    res.status(500).json({
      success: false,
      message: 'Error testing fields',
      error: error.message
    });
  }
};

// Filter eligible students
const filterEligibleStudents = async (req, res) => {
  try {
    const {
      minTenthPercentage,
      minTwelfthPercentage,
      minUgPercentage,
      maxBacklogs,
      gender
    } = req.body;

    console.log('Received filters:', req.body);
    console.log('Database:', mongoose.connection.name);
    console.log('Collection:', Student.collection.name);

    // Build query
    let query = {};

    if (minTenthPercentage !== undefined && minTenthPercentage !== null && minTenthPercentage !== '') {
      query.sscPercentage = { $gte: parseFloat(minTenthPercentage) };
    }

    if (minTwelfthPercentage !== undefined && minTwelfthPercentage !== null && minTwelfthPercentage !== '') {
      query.interPercentage = { $gte: parseFloat(minTwelfthPercentage) };
    }

    if (minUgPercentage !== undefined && minUgPercentage !== null && minUgPercentage !== '') {
      query.btechPercentage = { $gte: parseFloat(minUgPercentage) };
    }

    if (maxBacklogs !== undefined && maxBacklogs !== null && maxBacklogs !== '') {
      query.backlogCount = { $lte: parseInt(maxBacklogs) };
    }

    if (gender && gender !== 'Both') {
      query.gender = gender;
    }

    console.log('MongoDB Query:', JSON.stringify(query, null, 2));

    // Get total count
    const totalStudents = await Student.countDocuments({});
    console.log('Total students in database:', totalStudents);

    // Execute filter query
    const eligibleStudents = await Student.find(query);
    console.log('Eligible students found:', eligibleStudents.length);

    // Calculate statistics
    const stats = {
      totalEligible: eligibleStudents.length,
      avgBtechPercentage: eligibleStudents.length > 0 
        ? (eligibleStudents.reduce((sum, student) => sum + student.btechPercentage, 0) / eligibleStudents.length).toFixed(2)
        : 0,
      genderDistribution: {
        male: eligibleStudents.filter(s => s.gender === 'Male').length,
        female: eligibleStudents.filter(s => s.gender === 'Female').length
      }
    };

    res.status(200).json({
      success: true,
      count: eligibleStudents.length,
      totalInDb: totalStudents,
      stats,
      data: eligibleStudents
    });

  } catch (error) {
    console.error('Error filtering students:', error);
    res.status(500).json({
      success: false,
      message: 'Error filtering students',
      error: error.message
    });
  }
};

// Get all students
const getAllStudents = async (req, res) => {
  try {
    console.log('Fetching from database:', mongoose.connection.name);
    console.log('Collection:', Student.collection.name);
    
    const students = await Student.find({}).limit(10);
    console.log('Students found:', students.length);
    
    res.status(200).json({
      success: true,
      count: students.length,
      database: mongoose.connection.name,
      collection: Student.collection.name,
      data: students
    });
  } catch (error) {
    console.error('Error fetching students:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching students',
      error: error.message
    });
  }
};

module.exports = {
  filterEligibleStudents,
  getAllStudents,
  testDatabaseFields
};