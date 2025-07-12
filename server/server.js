import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.js';
import db from "./db.js";
import session from 'express-session';

// const express = require('express');
// const cors = require('cors');
// const authRoutes = require('./routes/auth')

// boiler plate express server creation, I stole from the internet.

//simply setting the server to a varaible. 
const app = express();
//listening port
const port = 3000;


////////USED AI TO WALK THROUGH SESSION SETUP/////
app.use(session({
    secret: 'supersecret',
    resave: false,
    saveUninitialized: true,
    cookie: {secure:false}
}));



//tells the server to parse incoming json data to a JS object
app.use(express.json());
//using cors to allow the front and back to be served on separate ports. May remove this later and serve both using express(front is utilizing vite for developement);
app.use(cors());
//this registers a router called 'authRoutes'
app.use('/api', authRoutes);

//test route
app.get('/', (req, res) => {
    res.send('Server Active');
}); 

//starts server and prints verification message
app.listen(port, () => {
    console.log(`Server listening on ${port}`)
});