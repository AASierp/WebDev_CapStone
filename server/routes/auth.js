import express from "express";
import bcrypt from "bcrypt";
import db from "../db/db.js";

// const express = require('express');
// const bcrypt = require('bcrypt');
// const db = require('../db');

const router = express.Router();

function requireLogin(req, res, next) {
  if (!req.session.userId) {
    return res.status(401).send("please log in to access this site");
  }
  next();
}

//////////////////////ROUTES///////////////////////////////////////////////////////////////////////////

// creates route that is listening for for post requests from the front end @ /register
// when a request is made, like submitting a form, this runs.

router.post("/register", async (req, res) => {
  //setting the email and password sent in the request body to constant variables.
  const email = req.body.email;
  const password = req.body.password;

  try {
    //hashing the password before being sent to the database.
    const hash = await bcrypt.hash(password, 13);
    //console.log(hash);
    //using a 'prepared statement' here to prevent sql injection -
    //basically predefining the sql query and setting the values as parameters so they cant be manipulated fomr the outside

    const dbInsert = db.prepare(
      "INSERT INTO users(email, password) VALUES( ?, ?)"
    );
    //inserts the email and hashed password into the query and runs
    //console.log(dbInsert);
    dbInsert.run(email, hash);

    // just sending a response if successful
    res.status(200);
    res.json("Database Insertion Successful");
  } catch (error) {
    //response if not successful - in this particular case there is a 'UNIQUE'(prevents duplication) constaint on the email address.
    if (error.code === "SQLITE_CONSTRAINT_UNIQUE") {
      res.status(400);
      res.json("An Account With This Email Already Exists");
    } else {
      console.error(error);
      res.status(500);
      res.json("Server Unavailable");
    }
  }
});

//post req from login
router.post("/login", async (req, res) => {
  //assign email/pass sent in post req to const
  const email = req.body.email;
  const password = req.body.password;

  try {
    //pepare query to be sent to db, passing email as param
    let query = db.prepare("SELECT * FROM users WHERE email = ?");
    //sends prepared query to db for user w/ email = email passed as param
    let user = query.get(email);

    if (!user) {
      //response if user does not exist
      res.status(400);
      res.json("This email is not registered to an existing user");
      return;
    }

    //password comparison ( still not sure how this works exactly)
    const passMatch = await bcrypt.compare(password, user.password);

    //response if password does not match what is in db - after 'unhashing'?
    if (!passMatch) {
      res.status(400);
      res.json("Password is not correct, please try again");
      return;
    }

    // saves user id/email into session (server memory)
    req.session.userId = user.id;
    req.session.email = user.email;
    //success response
    res.status(200);
    res.send("Login was a success");
  } catch (error) {
    console.error(error);
    res.status(500);
    res.send("Server not reachable");
  }
});

//checks to see if user is logged in
router.get("/session", async (req, res) => {
  // if logged int
  if (req.session.userId) {
    res.json({ isLoggedIn: true, email: req.session.email });
  }
  //if not logged in
  else {
    res.json({ isLoggedIn: false });
  }
});

//clears user data on logout
router.post("/logout", requireLogin, async (req, res) => {
  req.session.destroy();
  res.clearCookie("connect.sid");
  res.send("logged out");
});



///////////////////////////////////ROUTES END//////////////////////////////////////////////////

// exports to make avaible to the rest of the application
export default router;
