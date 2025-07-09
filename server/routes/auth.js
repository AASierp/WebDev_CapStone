import express from 'express';
import bcrypt from 'bcrypt';
import db from '../db.js'

// const express = require('express');
// const bcrypt = require('bcrypt');
// const db = require('../db');

const router = express.Router();

// creates route that is listening for for post requests from the front end @ /register
// when a request is made, like submitting a form, this runs.

router.post('/register', async (req, res) => {

    //setting the email and password sent in the request body to constant variables.
    const email = req.body.email;
    const password = req.body.password;


    try {

        //hashing the password before being sent to the database.
        const hash = await bcrypt.hash(password, 13);
        //console.log(hash);
        //using a 'prepared statement' here to prevent sql injection - 
        //basically predefining the sql query and setting the values as parameters so they cant be manipulated fomr the outside

        const dbInsert = db.prepare('INSERT INTO users(email, password) VALUES( ?, ?)');
        //inserts the email and hashed password into the query and runs
        //console.log(dbInsert);
        dbInsert.run(email, hash);

        // just sending a response if successful
        res.status(201)
        res.send('Database Insertion Successful');
    } 
    catch (error) {
        //response if not successful - in this particular case there is a 'UNIQUE'(prevents duplication) constaint on the email address.
        if(error.code === 'SQLITE_CONSTRAINT'){
            res.status(400)
            res.send('An Account With This Email Already Exists')
        }
        else{
            console.error(error)
            res.status(500);
            res.send('Server Unavailable');
        }
    }
});

// exports to make avaible to the rest of the application
export default router;

