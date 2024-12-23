import axios from 'axios';
import dotenv from 'dotenv';


dotenv.config({ path: '../../.env'});


const BUNGIE_API_KEY = process.env.BUNGIE_API_KEY;
const API_ROOT_PATH = 'https://www.bungie.net/Platform';


// API Call used to fetch information for metrics like name, hash, inProgressStyle


const fetchMetricDefinition = async (metricHash) => { 
    try {
        const response = await axios.get(`${API_ROOT_PATH}/Destiny2/Manifest/DestinyMetricDefinition/${metricHash}/`, {
            headers: {
                'X-API-KEY': BUNGIE_API_KEY
            }
        });

        // Check if the response contains actual data
        if (response.data.ErrorCode !== 1 || response.data.ErrorStatus !== 'Success') {
            throw new Error('Error fetching metric definition: ' + response.data.Message);
        }

        // Extract and return the metric definition
        const metricDefinition = response.data.Response;
        return metricDefinition;
    } catch (error) {
        console.error('Error fetching metric definition:', error);
        throw error;
    }
};

//Organizes metrics by groups based on presentation node data.
/**
 * 
 * @param {*} presentationNodes Array of presentation node data
 * @param {*} accessToken The access token for Bungie API authorization.
 * @param {*} membershipType  The membership type of the user.
 * @param {*} membershipId The membership ID of the user.
 * @returns 
 */

export async function organizeMetricsByGroups(presentationNodes) {
    const organizedMetrics = {};

    for (const node of presentationNodes) { // Takes in an array of objects. Each with a presentationNodeHash and a categoryName
        const nodeHash = node.presentationNodeHash; // Take the NodeHash of the category
        const nodeData = await fetchPresentationNodeMetrics(nodeHash); // Returns the hashes of all metrics associated with that NodeHash

        if (!nodeData || nodeData.length === 0) {
            continue; // Skip if no metrics are found for the node
        }

        organizedMetrics[node.categoryName] = []; // Create an array of every category

        for (const metric of nodeData) {
            const metricData = await fetchMetricDefinition(metric.metricHash); // Get data about metric (doesn't include group name)

            if (!metricData) {
                continue; // Skip if metric data is not available
            }

            const groupName = getGroupName(metricData); // Determine the group name
            const metricName = metricData.displayProperties.name; // The name of the metric
            let metricDescription = metricData.displayProperties.description; //Description of the metric
            
            organizedMetrics[node.categoryName].push({ //Organize metrics in a JSON-like structure
                name: metricName,
                description: metricDescription,
                groupName: groupName,
                metricHash: metric.metricHash
            });
        }
    }

    return organizedMetrics;
}

/*
API that takes in a hash which refers to a category of metrics
Returns the hash of all metrics associated with that hash/category */
export async function fetchPresentationNodeMetrics(presentationNodeHash) { 
    try {
        const response = await axios.get(`${API_ROOT_PATH}/Destiny2/Manifest/DestinyPresentationNodeDefinition/${presentationNodeHash}/`, {
            headers: {
                'X-API-KEY': BUNGIE_API_KEY
            }
        });

        if (response.data.ErrorCode !== 1 || response.data.ErrorStatus !== 'Success') {
            throw new Error('Error fetching presentation node metrics: ' + response.data.Message);
        }

        return response.data.Response.children.metrics;
    } catch (error) {
        console.error('Error fetching presentation node metrics:', error);
        throw error;
    }
}


function getGroupName(metricData) { 
    const priorityTraits = [
        { name: "Career", hash: 4263853822 },
        { name: "Seasonal", hash: 2230116619 },
        { name: "Weekly", hash: 2356777566 }
    ];

    if (!metricData || !metricData.traitHashes || metricData.traitHashes.length === 0) {
        return "Other"; // Default group name if no traits are found
    }

    for (const trait of priorityTraits) {
        if (metricData.traitHashes.includes(trait.hash)) {
            return trait.name; // Return the group name if the trait is found
        }
    }

    return "Other"; // Default group name if none of the priority traits are found
}

