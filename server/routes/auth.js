import express from 'express';
import bcrypt from 'bcrypt';
import db from '../db.js'

// const express = require('express');
// const bcrypt = require('bcrypt');
// const db = require('../db');

const router = express.Router();

//////////////////////ROUTES///////////////////////////////////////////////////////////////////////////

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
        if(error.code === 'SQLITE_CONSTRAINT_UNIQUE'){
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

router.post('/login', async (req, res) => {

    const email = req.body.email;
    const password = req.body.password;

    try{
        let query = db.prepare('SELECT * FROM users WHERE email = ?')
        let user = query.get(email);

        if(!user){
            res.status(400);
            res.send("This email is not registered to an existing user");
            return
        }

        const passMatch = bcrypt.compare(password, user.password);

        if(!passMatch){
            res.status(400);
            res.send("Password is not correct, please try again");
            return
        }

        req.session.userId = user.Id;
        req.session.email = user.email;

        res.status(200)
        res.send("Login was a success")

    }catch(error){
        console.error(error);
        res.status(500);
        res.send('Server not reachable');

    }

});

router.get('/session', async (req, res) =>{

    if(req.session.user.Id){
        res.json({isLoggedIn: true, email: req.session.email});
    }
    else{
        res.json({isLoggedIn: false});
    }
});

router.post('/logout', async (req, res) =>{
    req.session.destroy();
    req.clearCookies('connect.sid');
    res.send('logged out')
});

///////////////////////////////////ROUTES END//////////////////////////////////////////////////



// exports to make avaible to the rest of the application
export default router;

