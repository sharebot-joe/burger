// // Make sure we wait to attach our handlers until the DOM is fully loaded.
// $(function() {
  
//   $(".devour").on("click", function(event) {
//     var id = $(this).data("id");
//     console.log('id', id)
//     // Send the DELETE request.
//     $.ajax("/delete/" + id, {
//       type: "POST"
//     }).then(
//       function() {
//         console.log("deleted burger ", id);
//         // Reload the page to get the updated list
//         location.reload();
//       }
//     );
//   });


// });

$(document).ready(function() {
    
  $(".devour-form").on("submit", function(event) {
    event.preventDefault();

    var burger_id = $(this).children(".burger_id").val();
    console.log(burger_id);
    $.ajax({
      method: "PUT",
      url: "/burgers/" + burger_id
    }).then(function(data) {
      // reload page to display devoured burger in proper column
      location.reload();
    });

  });
});
