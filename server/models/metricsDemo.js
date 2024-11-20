import mongoose from 'mongoose';

// Define the schema for MetricsDemo
const metricsDemoSchema = new mongoose.Schema({
  displayName: { type: String, required: true },
  stats: [{
    name: { type: String, required: true },
    description: { type: String, required: true },
    progress: { type: mongoose.Schema.Types.Mixed, required: true }, // Use Mixed type for various types of data
  }],
});

const MetricsDemo = mongoose.model('MetricsDemo', metricsDemoSchema);

export default MetricsDemo;
