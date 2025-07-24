import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.js";
import "./db/db.js";
import session from "express-session";
import tasksRoutes from "./routes/tasks.js";

//simply setting the server to a varaible.
const app = express();
//listening port
const port = 3000;

////////USED CHATGPT TO WALK THROUGH SESSION SETUP/////
app.use(
  session({
    secret: "supersecret", //assigns a session ID cookie
    resave: false, // dont save if nothing has changed
    saveUninitialized: false, // dont create session unitl ended
    cookie: {
      secure: false, // for http - https would be true
      maxAge: 1000 * 60 * 60 * 24, // session expiration time (24hr)
    },
  })
);

//tells the server to parse incoming json data to a JS object
app.use(express.json());
//using cors to allow the front and back to be served on separate ports. May remove this later and serve both using express(front is utilizing vite for developement);
app.use(
  cors({
    origin: "http://localhost:5173", //only allow traffic from front-end (if this were deployed it owul be th url);
    credentials: true, // allows cookies/sessions to work accross requests
  })
);
//this registers a router called 'authRoutes'
app.use("/api", authRoutes);
app.use("/api", tasksRoutes);

//starts server and prints verification message
app.listen(port, () => {
  console.log(`Server listening on ${port}`);
});
