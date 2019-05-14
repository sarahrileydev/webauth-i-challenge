const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const session = require("express-session");
const KnexSessionStore = require("connect-session-knex")(session); 

const sessionConfig = {
  name: "monkey", 
  secret: "keep it secret, keep it safe!", 
  cookie: {
    maxAge: 1000 * 60 * 60,
    secure: false 
  },
  httpOnly: true, 
  resave: false, 
  saveUninitialized: false,

  store: new KnexSessionStore({
    knex: require("../database/dbConfig"),
    tablename: "session", 
    sidfieldname: "sid",
    createtable: true, 
    clearInterval: 1000 * 60 * 60 
  })
};

const authRouter = require("../auth/auth-router.js");
const usersRouter = require("../users/users-router.js");

const server = express();

server.use(helmet());
server.use(express.json());
server.use(cors());
server.use(session(sessionConfig));

server.use("/api/auth", authRouter);
server.use("/api/users", usersRouter);

server.get("/", (req, res) => {
  res.send("It's alive!");
});

module.exports = server;