// Schema for the metrics on the the demo page

import mongoose from 'mongoose';

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
          metricHash: { type: String, required: true }
        },
      ],
    },
  ],
});

const MetricsDemo = mongoose.model('MetricsDemo', MetricsDemoSchema);

export default MetricsDemo;
