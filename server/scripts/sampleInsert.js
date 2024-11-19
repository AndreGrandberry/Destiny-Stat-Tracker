import connectDB from '../db/connection.js';
import Metric from '../models/metric.js';

const insertSampleData = async () => {
  try {
    await connectDB();

    const result = await Metric.deleteMany({});
    console.log(`${result.deletedCount} metric(s) deleted.`);

  } catch (error) {
    console.error('Error inserting data:', error.message);
  }
};

insertSampleData();
