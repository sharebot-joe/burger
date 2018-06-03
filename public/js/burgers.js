// Make sure we wait to attach our handlers until the DOM is fully loaded.
$(function() {
  $("#new-burger").on("submit", function(event) {
    // Make sure to preventDefault on a submit event.
    event.preventDefault();

    var newBurger = $.trim($("textarea").val());
    if (val != "") {
      // Send the POST request.
      $.ajax("/", {
        type: "POST",
        data: newBurger
      }).then(
        function() {
          console.log("created new burger");
          // Reload the page to get the updated list
          location.reload();
        }
      );
    }

  });

});
