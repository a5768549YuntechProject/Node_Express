const express = require("express");
const mysql = require("mysql");
const logger = require("morgan");
const flash = require("express-flash");
const session = require('express-session');
// const cookieParser = require('cookie-parser');
const myConnection = require("express-myconnection");
const overwriteHtmlPath = require("./middlewares/overwriteHtmlPath");
const RootRouter = require("./routers");

const config = require("./config.json");
const serverConfig = config.server;
const databaseConfig = config.databases.default;

const app = express();

const databaseOptions = {
    host: databaseConfig.hostname,
    user: databaseConfig.username,
    password: databaseConfig.password,
    port: databaseConfig.port,
    database: databaseConfig.database,
};

const sessionOptions = {
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 60000 },
}

app.use(logger("dev"));
app.use(myConnection(mysql, databaseOptions, "pool"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// app.use(cookieParser('keyboard cat'));
app.use(session(sessionOptions));
app.use(flash());
app.use(overwriteHtmlPath("." + serverConfig.publicDir));
app.use(express.static("." + serverConfig.publicDir));
app.use("/api", RootRouter);
app.listen(serverConfig.port, () =>
    console.log("listen on", serverConfig.port)
);