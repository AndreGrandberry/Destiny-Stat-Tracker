import express from 'express';
import session from 'express-session';
import RedisStore from 'connect-redis';
import { createClient } from 'redis';
// import morgan from 'morgan';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import AppError from './AppError.js';

import auth from './routes/auth.js';
import api from './routes/api.js';

dotenv.config({ path: '../.env' });


// Define __dirname for ES Module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const URL = process.env.URL;

// Configure the Redis client
const client = createClient({
    url: URL
});

client.on('connect', () => {
    console.log('Connected to Redis server')
});

// Redis error handling
client.on("error", (error) => console.error(`Redis error: ${error}`));

// Connect to Redis
await client.connect();



const app = express();

const PORT = process.env.PORT || 8080;

// Set up session middleware
app.use(
    session({
        store: new RedisStore({ client: client}),
        secret: 'yourSecretKey',
        resave: false,
        saveUninitialized: false,
        cookie: { secure: false }
        
    })
);

// app.use(morgan('tiny'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static('dist')); // Serve the frontend files 

//Routes
app.use("/auth", auth);
app.use("/api", api)

 // EJS setup to server the error.ejs template
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/views'))


// app.get('/set-session', (req, res) => {
//     req.session.user = {
//         id: 'user123',
//         accessToken: 'yourAccessToken'
//     };
//     res.send('Session data saved!')
// });

// app.get('/get-session', (req, res) => {
//     if (req.session.user) {
//         res.send(`User ID: ${req.session.user.id}, Access Token: ${req.session.user.accessToken}`)
//     } else {
//         res.send('No session data found');
//     }
// });

app.all('*', (req, res, next) => {
    next(new AppError('Page Not Found', 404));
});



app.use((err, req, res, next) => {
    const status = err.statusCode || 500; // Fallback to 500 for unknown errors
    const message = err.message || 'Internal Server Error';
    
    res.status(status).render('error', { message, status });
});



app.listen(PORT, () => console.log(`Server started on port ${PORT}`));

export default { app, client };
