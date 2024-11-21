import mongoose from 'mongoose';

// Define the schema for MetricsDemo
const MetricsDemoSchema = new mongoose.Schema({
  categories: [
    {
      categoryName: { type: String, required: true },
      metrics: [
        {
          name: { type: String, required: true },
          description: { type: String },
          progress: { type: Number },
          groupName: { type: String },
        },
      ],
    },
  ],
});

const MetricsDemo = mongoose.model('MetricsDemo', MetricsDemoSchema);

export default MetricsDemo;
