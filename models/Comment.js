var mongoose = require("mongoose");

// This section creates a variable which saves the Schema constructor
var Schema = mongoose.Schema;

// This section creates a variable that creates a comment schema object
// The object contains title and body strings
var CommentSchema = new Schema({

  title: String,

  body: String
});

// This creates our model from the above schema, using mongoose's model method
var Comment = mongoose.model("Comment", CommentSchema);

// This section sets up an Export for the Comment model created above
module.exports = Comment;