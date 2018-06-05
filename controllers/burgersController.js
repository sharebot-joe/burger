var express = require("express");

var router = express.Router();

// Import the model (burger.js) to use its database functions.
var burger = require("../models/burger.js");

// Create all our routes and set up logic within those routes where required.
router.get("/index", function(req, res) {
  burger.selectAll(function(data) {
    var hbsObject = {
      burgers: data
    };
    console.log(hbsObject);
    res.render("index", hbsObject);
  });
});

router.post("/", function(req, res) {
  burger.insertOne("burgers", req.body.burger, function(result) {
    res.redirect("/index")
    // res.json({result});
  });

});

router.post("/delete/:id", function(req, res) {
  var deleteID = req.params.id
  burger.updateOne("burgers", {devoured: true}, id = deleteID, function(result) {
    // res.redirect("/index")
    res.json({result});
  });

});


// Export routes for server.js to use.
module.exports = router;
