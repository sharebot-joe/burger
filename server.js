var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');

// This is to account for Heroku's assigning random ports for deployment
// var PORT = process.env.PORT || 8080;
var PORT = 8080;
var app = express();
const addRequestId = require('express-request-id')();

const logger = require('./logger');

const morgan = require('morgan');


var loggerFormat = ':id [:date[web]]" :method :url" :status :responsetime';

app.use(addRequestId);

morgan.token('id', function getId(req) {
    return req.id
});

app.use(morgan(loggerFormat, {
    skip: function (req, res) {
        return res.statusCode < 400
    },
    stream: process.stderr
}));
app.use(morgan(loggerFormat, {
    skip: function (req, res) {
        return res.statusCode >= 400
    },
    stream: process.stdout
}));

app.use(function (req, res, next){
    var log = logger.loggerInstance.child({
        id: req.id,
        body: req.body
    }, true)
    log.info({req: req})
    next();
});

app.use(function (req, res, next) {
    function afterResponse() {
        res.removeListener('finish', afterResponse);
        res.removeListener('close', afterResponse);
        var log = logger.loggerInstance.child({
            id: req.id
        }, true)
       log.info({res:res}, 'response')
    }

    res.on('finish', afterResponse);
    res.on('close', afterResponse);
    next();
});

// For logging
app.get("/health", function (req, res) {
    res.status(200).send();
});

app.post("/stuff", function (req, res) {

    var response = {
        fullname: `${req.body.firstname} ${req.body.lastname}`
    }
    logger.logResponse(req.id, response, 200);
    res.status(200).send(response);
});

// Serve static content for the app from the "public" directory in the application directory.
app.use(express.static(path.join(__dirname, '/public')));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// parse application/json
app.use(bodyParser.json());

// Set Handlebars.
var exphbs = require("express-handlebars");

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

// Import routes and give the server access to them.
var routes = require("./controllers/burgersController.js");

app.use(routes);
// app.use('/', routes)


app.listen(PORT, function() {
  console.log("App now listening at localhost:" + PORT);
});
