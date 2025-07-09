import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.js';
import db from "./db.js";

// const express = require('express');
// const cors = require('cors');
// const authRoutes = require('./routes/auth')

const app = express();
const port = 3000;

app.use(express.json());

app.use(cors());

app.use('/api', authRoutes);

app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

app.get('/', (req, res) => {
    res.send('Server Active');
}); 

app.listen(port, () => {
    console.log(`Server listening on ${port}`)
});