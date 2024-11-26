// Controller functions for the /auth/callback route to handle OAuth

import axios from 'axios';
import AppError from '../AppError.js';
import dotenv from 'dotenv';

dotenv.config({ path: '../../.env' });



const API_ROOT_PATH = 'https://www.bungie.net/Platform' 



// Function to handle the OAuth flow
export const handleOAuthCallback = async (req, res, next) => {
    try {
        
        const { code } = req.query; // Receive the authorization code from the query params
        if (!code) {
            throw new AppError('Authorization code missing', 400);
        }
        
        const tokenEndpoint = `${API_ROOT_PATH}/App/Oauth/Token/`; 

        const basicAuth = Buffer.from(`${process.env.OAUTH_CLIENT_ID}:${process.env.OAUTH_CLIENT_SECRET}`).toString('base64'); // Exchange access code for and access token
        
        const tokenResponse = await axios.post(tokenEndpoint,
            `grant_type=authorization_code&code=${code}&client_id=${process.env.OAUTH_CLIENT_ID}&client_secret=${process.env.OAUTH_CLIENT_SECRET}&redirect_uri=https://destiny-stat-tracker.com/auth/callback`,
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
                'X-API-KEY': process.env.BUNGIE_API_KEY,
                
            },
        });

        // Extract necessary information from the response

        
        const { destinyMemberships } = userResponse.data.Response;
       
        
        let primaryMembership = null;
        for (let membership of destinyMemberships) {
            if (membership.crossSaveOverride === 1) {
                primaryMembership = membership; // Take the overridden membership (primary)
                break;
            }
        }

        if (!primaryMembership) {
            primaryMembership = destinyMemberships[0];
        }

        if (!primaryMembership) {
            throw new AppError('No primary membership found', 400);
        }

        const { membershipId, membershipType } = primaryMembership;

        // Save user data to Redis session.

        req.session.membershipType = membershipType; 
        req.session.membershipId = membershipId;

        res.redirect('https://destiny-stat-tracker.com/dashboard'); // Redirect to the dashboard
    } catch (error) {
        console.log(error)
        next(new AppError('OAuth Callback Failed', 500))
    }
};


