import express from "express";
import bcrypt from "bcrypt";
import db from "../db/db.js";

// const express = require('express');
// const bcrypt = require('bcrypt');
// const db = require('../db');

const router = express.Router();

export function requireLogin(req, res, next) {
  if (!req.session.userId) {
    return res.status(401).send("please log in to access this site");
  }
  next();
}

//////////////////////ROUTES///////////////////////////////////////////////////////////////////////////

// creates route that is listening for for post requests from the front end @ /register
// when a request is made, like submitting a form, this runs.

router.post("/register", async (req, res) => {
  //setting the email and password sent in the request body to constant.
  const email = req.body.email;
  const password = req.body.password;
  const username = req.body.username;

  try {
    //hashing the password before being sent to the database.
    const hash = await bcrypt.hash(password, 13);
    //console.log(hash);
    //using a 'prepared statement' here to prevent sql injection -
    //basically predefining the sql query and setting the values as parameters so they cant be manipulated fomr the outside

    const dbInsert = db.prepare(
      "INSERT INTO users(email, password, username) VALUES( ?, ?, ?)"
    );
    //inserts the email and hashed password into the query and runs
    //console.log(dbInsert);
    dbInsert.run(email, hash, username);

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
    //Had a lot of AI help with using/understing Sessions
    //THis is where session credentials are first created and tied to user info from DB
    //this info is now tied to a cookie and will be used in all future request for auth and state
    //saves user id/email/username into session (server memory)
    req.session.userId = user.id;
    req.session.email = user.email;
    req.session.username = user.username;
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
  // if logged in
  if (req.session.userId) {
    res.json({
      isLoggedIn: true,
      email: req.session.email,
      username: req.session.username,
    });
    console.log("Logged in!");
  }
  //if not logged in
  else {
    res.json({ isLoggedIn: false });
    console.log("not logged in");
  }
});

//clears user data on logout
router.post("/logout", requireLogin, async (req, res) => {
  req.session.destroy((error) => {
    if (error) {
      console.error("Session not destroyed", error);
      return res.status(500).send("could not log out");
    }
    res.clearCookie("connect.sid");
    res.send("logged out");
  });
});

// exports to make avaible to the rest of the application
export default router;
