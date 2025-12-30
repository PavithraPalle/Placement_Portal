const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Add these options for better connection handling
    const options = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    };

    const conn = await mongoose.connect(process.env.MONGO_URI, options);

    console.log(`✅ MongoDB Connected Successfully`);
    console.log(`✅ Host: ${conn.connection.host}`);
    console.log(`✅ Database: ${conn.connection.name}`);
    console.log(`✅ Ready State: ${conn.connection.readyState}`); // Should be 1

    // Verify collections exist
    mongoose.connection.on('connected', async () => {
      const collections = await mongoose.connection.db.listCollections().toArray();
      console.log('✅ Collections:', collections.map(c => c.name));
    });

    mongoose.connection.on('error', (err) => {
      console.error('❌ MongoDB connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      console.log('⚠️ MongoDB disconnected');
    });

  } catch (error) {
    console.error('❌ Database Connection Failed:', error.message);
    
    // If Atlas connection fails, try connecting to local MongoDB
    console.log('⚠️ Trying local MongoDB connection...');
    try {
      const localConn = await mongoose.connect('mongodb://localhost:27017/student_db', {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      console.log(`✅ Connected to Local MongoDB: ${localConn.connection.name}`);
    } catch (localError) {
      console.error('❌ Local MongoDB connection also failed');
      process.exit(1);
    }
  }
};

module.exports = connectDB;