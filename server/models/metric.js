// Schema for the metrics/stats stored in the db
import mongoose from "mongoose";

const MetricSchema = new mongoose.Schema({
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

const Metric = mongoose.model("Metric", MetricSchema);

export default Metric;
