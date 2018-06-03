// Import the ORM to create functions that will interact with the database.
var orm = require("../config/orm.js");

var burger = {
  selectAll: function(cb) {
    orm.selectAll("burgers", function(res) {
      cb(res);
    });
  },
  // The variable val is a string
  insertOne: function(table, val, cb) {
    orm.insertOne("burgers", val, function(res) {
      cb(res);
    });
  },
  // An example of objColVal would be {name: cheeseburger}. 
  updateOne: function(table, objColVal, condition, cb) {
    orm.updateOne("burgers", objColVal, condition, function(res) {
      cb(res);
    });
  },
};

// Export the database functions for the controller (burgersController.js).
module.exports = burger;
