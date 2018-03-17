// This section gets the stories from the database and returns them in json form
$.getJSON("/stories", function(data) {
  // This section runs a for loop for the data returned from the database
  for (var i = 0; i < data.length; i++) {
    // This section sets up what to display on the page from the information pulled
    $("#stories").append("<p data-id='" + data[i]._id + "'>" + data[i].headline + "<br />" + data[i].url + "</p>");
  }
});


// This section sets up the jQuery portion of the frontend 
$(document).on("click", "p", function() {
  // This section runs the .empty function for the comments id to empty it out
  $("#comments").empty();
  // This section creates a variable to save the id from the p tag
  var thisId = $(this).attr("data-id");

  // This section sets up the ajax call to the database for the stories
  $.ajax({
    method: "GET",
    url: "/stories/" + thisId
  })
    // This section adds the comments to the page
    .then(function(data) {
      console.log(data);
      // This section sets up an html headline tag 
      $("#comments").append("<h2>" + data.title + "</h2>");
      // This section sets up an input field 
      $("#comments").append("<input id='titleinput' name='title' >");
      // This section creates a body textarea ody
      $("#comments").append("<textarea id='bodyinput' name='body'></textarea>");
      // This section creates a submit button
      $("#comments").append("<button data-id='" + data._id + "' id='savecomment'>Save Comment</button>");

      // This section creates an if statement that defines what to do if there is a comment to post
      if (data.comment) {
        
        $("#titleinput").val(data.comment.title);
        $("#bodyinput").val(data.comment.body);
      }
    });
});

// This section sets up a document .on click event for to save the comment
$(document).on("click", "#savecomment", function() {
  
  var thisId = $(this).attr("data-id");

  // This section sets up another ajax call to post a change to a comment
  $.ajax({
    method: "POST",
    url: "/stories/" + thisId,
    data: {
      // This section takes in the values for the title and body inputs
      title: $("#titleinput").val(),
      body: $("#bodyinput").val()
    }
  })

    .then(function(data) {
      // This section console logs the data response
      console.log(data);
      // This section runs the .empty function to empty out the comment
      $("#comments").empty();
    });

  // This section removes the values entered into each field
  $("#titleinput").val("");
  $("#bodyinput").val("");
});
