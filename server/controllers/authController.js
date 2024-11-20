//authController.js
import axios from 'axios';
import AppError from '../AppError.js';
import dotenv from 'dotenv';

dotenv.config({ path: '../../.env' });



const API_ROOT_PATH = 'https://www.bungie.net/Platform' 
const OAUTH_CLIENT_ID = process.env.OAUTH_CLIENT_ID;
const OAUTH_CLIENT_SECRET = process.env.OAUTH_CLIENT_SECRET;
const BUNGIE_API_KEY = process.env.BUNGIE_API_KEY;


// function to handle the OAuth flow
export const handleOAuthCallback = async (req, res, next) => {
    try {
        
        console.log('Client Id: ', OAUTH_CLIENT_ID);
        console.log('Client Secret: ', OAUTH_CLIENT_SECRET);
        console.log('Bungie API Key', BUNGIE_API_KEY);
        console.log('Auth flow initiated');
        const { code } = req.query; // Receive the authorization code from the query params
        console.log('Authorization code received:', code);

        if (!code) {
            throw new AppError('Authorization code missing', 400);
        }
        
        const tokenEndpoint = `${API_ROOT_PATH}/App/Oauth/Token/`; 

        const basicAuth = Buffer.from(`${OAUTH_CLIENT_ID}:${OAUTH_CLIENT_SECRET}`).toString('base64'); // Exchange access code for and access token
        console.log('Client ID: ', OAUTH_CLIENT_ID)
        console.log('Client Secret: ', OAUTH_CLIENT_SECRET)
        const tokenResponse = await axios.post(tokenEndpoint,
            `grant_type=authorization_code&code=${code}&client_id=${OAUTH_CLIENT_ID}&client_secret=${OAUTH_CLIENT_SECRET}&redirect_uri=https://destiny-stat-tracker.com/auth/callback`,
            {
            
                headers:{
                    'Authorization':`Basic ${basicAuth}`,
                    'Content-Type': 'application/x-www-form-urlencoded',
                  
                  
                }
            }
        );

        const { access_token } = tokenResponse.data;


        req.session.accessToken = access_token; // Take the access token from the response and store it in sessions
        
         
        // Use access token to get user data from the OAuth provider
        const userEndpoint = `${API_ROOT_PATH}/User/GetMembershipsForCurrentUser/`;

        const userResponse = await axios.get(userEndpoint, {
            headers: {
                'Authorization': `Bearer ${access_token}`,
                'X-API-KEY': BUNGIE_API_KEY,
                
            },
        });

        // Extract necessary information from the response

        
        const { destinyMemberships } = userResponse.data.Response;

        const secondMembership = destinyMemberships[0];

        const displayName = userResponse.data.Response.bungieNetUser.uniqueName


        const { membershipId, crossSaveOverride } = secondMembership; // Acquire the override membershipId and crossSaveOveride from response


       

        // Save user data to the database
        const membershipType = crossSaveOverride; // Membershiptype/crossaveSaveOrride are data points that represent the primary console of the user

        req.session.membershipType = membershipType; // Save user information into session.
        req.session.membershipId = membershipId;
        req.session.displayName = displayName;
      
        

        res.redirect(`http://localhost:8080/api`); // Redirect to route that handles fetching and storing API information
    } catch (error) {
        console.log(error)
        next(new AppError('OAuth Callback Failed', 500))
    }
};


