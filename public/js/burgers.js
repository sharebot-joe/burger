// Make sure we wait to attach our handlers until the DOM is fully loaded.
$(function() {
  
  $(".devour").on("click", function(event) {
    var id = $(this).data("id");
    console.log('id', id)
    // Send the DELETE request.
    $.ajax("/delete/" + id, {
      type: "POST"
    }).then(
      function() {
        console.log("deleted burger ", id);
        // Reload the page to get the updated list
        location.reload();
      }
    );
  });


});
