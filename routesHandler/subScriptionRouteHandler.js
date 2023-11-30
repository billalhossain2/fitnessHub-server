const express = require('express')
const verifyJwt = require('../Middlewares/verifyJwt')
const verifyAdmin = require('../Middlewares/verifyAdmin')
const subscriptionRoutes = express.Router()

app.post("/subscriptions", async (req, res) => {
    try {
      const newSubscription = req.body;
      const result = await SubscriptionModel.create(newSubscription);
      res.send(result);
    } catch (error) {
      res
        .status(500)
        .send({ error: true, message: "There was a server side error" });
    }
  });
  
  app.get("/subscriptions",verifyJwt, verifyAdmin, async (req, res) => {
    try {
      const allSubscribers = await SubscriptionModel.find();
      res.send(allSubscribers);
    } catch (error) {
      res
        .status(500)
        .send({ error: true, message: "There was a server side error" });
    }
  });

  module.exports = subscriptionRoutes;
  
