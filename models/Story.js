var mongoose = require("mongoose");

// This section creates a variable which sets up the Schema constructor
var Schema = mongoose.Schema;

// This section creates a variable that uses the Schema constructor to create a new StorySchema object
// The object contains headline, url, and comment
var StorySchema = new Schema({
  
  headline: {
    type: String,
    required: true
  },

  summary: {
    type: String,
    required: true
  },

  url: {
    type: String,
    required: true
  },

  comment: {
    type: Schema.Types.ObjectId,
    ref: "Comment"
  }
});

// This section creates the Story model from the above schema 
var Story = mongoose.model("Story", StorySchema);

// This section creates an export the Story model
module.exports = Story;
