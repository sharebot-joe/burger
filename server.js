const express = require('express');

const app = express();
const bodyParser = require('body-parser');

const addRequestId = require('express-request-id')();
const morgan = require('morgan');
const logger = require('./logger')
var path = require('path');
// var favicon = require('serve-favicon');

// Load favicon
// app.use(favicon(path.join(__dirname,'public','images','favicon.ico')))

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));


// Import routes and give the server access to them.
var routes = require("./controllers/burgersController.js");




// Serve static content for the app from the "public" directory in the application directory.
// app.use(express.static('public'));
app.use('/public', express.static(path.resolve(__dirname, 'public')));
// app.use(express.static(path.join(__dirname, '/public')));


app.use(routes);
// app.use('/', routes)



// Set Handlebars.
var exphbs = require("express-handlebars");
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");


app.get("/health", function (req, res) {
    console.log('res.status', res.status)
    res.status(200).send();
});

app.use(addRequestId);

morgan.token('id', function getId(req) {
    return req.id
});

var loggerFormat = ':id [:date[web]] ":method :url" :status :response-time';

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

app.use((req, res, next) => {
    var log = logger.loggerInstance.child({
      id: req.id,
      body: req.body
    }, true)
    log.info({
      req: req
    })
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



app.post("/stuff", function (req, res) {

    var response = {
        fullname: `${req.body.firstname} ${req.body.lastname}`
    }
    logger.logResponse(req.id, response, 200);
    res.status(200).send(response);
});



app.set('port', process.env.PORT || 8080);
const server = app.listen(app.get('port'), () => {
    console.log(`Express running → PORT ${server.address().port}`);
});
