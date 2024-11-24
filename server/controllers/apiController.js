export const getMetricsWithProgress = async (membershipType, membershipId, accessToken) => {
  try {
    // Define the presentation nodes to organize categories
    const presentationNodes = [
      { presentationNodeHash: '3844527950', categoryName: "Seasons" },
      { presentationNodeHash: '2875839731', categoryName: "Account" },
      { presentationNodeHash: '565440981', categoryName: "Crucible" },
      { presentationNodeHash: '3707324621', categoryName: "Destination" },
      { presentationNodeHash: '4193411410', categoryName: "Gambit" },
      { presentationNodeHash: '926976517', categoryName: "Raids" },
      { presentationNodeHash: '2755216039', categoryName: "Strikes" },
      { presentationNodeHash: '3722177789', categoryName: "Trials of Osiris" }
    ];

    // Array to store the metric hashes
    let metricHashes = [];
    
    // Fetching the metric hashes from Bungie's API for each category
    for (const node of presentationNodes) {
      const nodeHash = node.presentationNodeHash;
      const nodeData = await fetchPresentationNodeMetrics(nodeHash, accessToken);
    
      // Store the metricHashes for each category
      for (const metric of nodeData) {
        metricHashes.push({ metricHash: metric.metricHash, categoryName: node.categoryName });
      }
    }
    
    // Fetch metrics data from the database
    const metricsData = await Metric.findOne().maxTimeMS(20000);
    if (!metricsData) {
      throw new Error("No metrics data found in the database.");
    }

    const { categories } = metricsData.toObject();

    // Fetch the progress data from Bungie API
    const progressData = await fetchAllMetricsProgress(membershipType, membershipId, accessToken);

    // Map the metrics data with the corresponding progress data
    const updatedCategories = categories.map((category) => ({
      categoryName: category.categoryName,
      metrics: category.metrics.map((met) => {
        // Find the corresponding metricHash for the metric from the category
        const matchedMetricHash = metricHashes.find((m) => m.categoryName === category.categoryName);

        // Get the progress data using the metricHash
        const progress = progressData[matchedMetricHash?.metricHash]?.objectiveProgress?.progress || 0;

        return {
          ...met,
          progress: progress, // Add the progress to the metric
        };
      }),
    }));

    return updatedCategories; // Return the updated categories with progress
  } catch (error) {
    console.error(error);
    throw error;
  }
};
