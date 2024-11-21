import express from 'express';
import session from 'express-session';
import RedisStore from 'connect-redis';
import { createClient } from 'redis';
// import morgan from 'morgan';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import AppError from './AppError.js';
import mongoose from 'mongoose';

import auth from './routes/auth.js';
import api from './routes/api.js';
import demo from './routes/demo.js';


dotenv.config({ path: '../.env' });

console.log('Loaded Client ID:', process.env.OAUTH_CLIENT_ID);


// Define __dirname for ES Module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const URL = process.env.URL;


// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB Atlas'))
  .catch((err) => console.log('Error connecting to MongoDB Atlas', err));



// Configure the Redis client
let client;
(async () => {
  client = createClient({
    url: URL
  });

  client.on('connect', () => {
    console.log('Connected to Redis server');
  });

  client.on("error", (error) => console.error(`Redis error: ${error}`));

  await client.connect(); // Ensure the client connects before we use it
  console.log('Redis client is initialized');
})();


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
app.use(express.static(path.join(__dirname, 'dist'))); 

//Routes
app.use("/auth", auth);
app.use("/api", api);
app.use("/demo", demo);

 // EJS setup to server the error.ejs template
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/views'))




app.all('*', (req, res, next) => {
  // Serve index.html for frontend React Router routes
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));

  // If page not found, throw an AppError
  next(new AppError('Page Not Found', 404));
});




app.use((err, req, res, next) => {
    const status = err.statusCode || 500; // Fallback to 500 for unknown errors
    const message = err.message || 'Internal Server Error';
    
    res.status(status).render('error', { message, status });
    if (status === 404) {
      // Render a custom 404 page if it's a 404 error
      res.status(404).render('404', { message });
    } else {
      // Render a generic error page for other errors
      res.status(status).render('error', { message, status });
    }
  
});



app.listen(PORT, () => console.log(`Server started on port ${PORT}`));

export { app, client };
