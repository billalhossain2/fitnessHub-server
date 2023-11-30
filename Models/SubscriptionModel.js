const mongoose = require('mongoose')

const subscriptionSchema = require("../Schemas/subscriptionSchema");

const SubscriptionModel = mongoose.model("Subscription", subscriptionSchema);

module.exports = SubscriptionModel;
