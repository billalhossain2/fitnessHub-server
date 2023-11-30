const {Schema} = require("mongoose");

const subscriptionSchema = new Schema({
  name: String,
  email: String,
});

module.exports = subscriptionSchema;
