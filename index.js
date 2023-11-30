const express = require("express");
const cors = require("cors");
const mongoose = require('mongoose')
const dotenv = require("dotenv");
dotenv.config();
const jwt = require("jsonwebtoken");
const stripe = require("stripe")(process.env.PAYMENT_SECRET_KEY);

const app = express();
const port = process.env.PORT || 9000;


//Models






//Built-in Middlewares
app.use(
  cors({
    origin: ["http://localhost:5173"],
    credentials: true,
  })
);
app.use(express.json());




//JWT Routes
app.post("/set-cookie", (req, res) => {
  const user = req.body;
  const token = jwt.sign(user, process.env.JWT_SECRET_KEY, { expiresIn: "1h" });
  console.log("Token", token);
  res.send({ token });
});

//Custom middlewares
const verifyJwt = (req, res, next) => {
  const token = req.headers?.authorization?.split(" ")[1]
  if(!token){
    res.status(401).send({error:true, message:"Unauthorized Access"})
    return;
  }

  jwt.verify(token, process.env.JWT_SECRET_KEY, (error, decoded)=>{
    if(error){
      res.status(403).send({error:true, message:"Forbidden Access"})
      return;
    }
    req.decoded = decoded
    next();
  })
};

const verifyAdmin = (req, res, next) => {
  const email = req.decoded?.email;
  console.log("Decoded email==========> ", email)
  next()
};


//default routes
app.get("/", (req, res) => {
  res.send(`Fitness server is running on port ${port}`);
});







//Connect to database using mongoose
mongoose.connect(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.0ak1okw.mongodb.net/fitnessDB?retryWrites=true&w=majority`)
.then(()=>{
    console.log("FitnessHub server connection was successful")
})
.catch(error => {
    console.log("FitnessHub server connection=====> ", error)
})

    const Blog = mongoose.model('Blog', {});

    app.get("/blogs", async (req, res) => {
      try {
        const blogs = await Blog.find({});
        res.send(blogs);
      } catch (error) {
        res
          .status(500)
          .send({ error: error, message: "There was a server side error" });
      }
    });


    
    const Feature = mongoose.model('Feature', {});

    app.get("/features", async (req, res) => {
      try {
        const features = await Feature.find({});
        res.send(features);
      } catch (error) {
        res
          .status(500)
          .send({ error: true, message: "There was a server side error" });
      }
    });



    const Review = mongoose.model('Review', {})

    app.get("/reviews", async (req, res) => {
      try {
        const reviews = await Review.find({});
        res.send(reviews);
      } catch (error) {
        res
          .status(500)
          .send({ error: true, message: "There was a server side error" });
      }
    });







    const Team = mongoose.model('Team', {})

    app.get("/teams", async (req, res) => {
      try {
        const team = await Team.find();
        res.send(team);
      } catch (error) {
        res
          .status(500)
          .send({ error: true, message: "There was a server side error" });
      }
    });


    
    const Gallerie = mongoose.model('Gallerie', {})

    app.get("/galleries", async (req, res) => {
      try {
        const galleries = await Gallerie.find();
        res.send(galleries);
      } catch (error) {
        res
          .status(500)
          .send({ error: true, message: "There was a server side error" });
      }
    });




//     /*================================== Payment  Related APIs =================================*/
//     app.post("/booking-payments", verifyJwt, async (req, res) => {
//       try {
//         const newPayment = req.body;
//         const result = await bookedPaymentsCollection.insertOne(newPayment);
//         res.send(result);
//       } catch (error) {
//         res
//           .status(500)
//           .send({ error: true, message: "There was a server side error" });
//       }
//     });

       const BookedPayment = mongoose.model('BookedPayment', {})
    app.get("/booking-payments",verifyJwt, async(req, res) => {
      try {
        const bookingPayments = await BookedPayment.find({});
        res.send(bookingPayments);
      } catch (error) {
        res
          .status(500)
          .send({ error: true, message: "There was a server side error" });
      }
    });


//     app.post("/trainer-payments", verifyJwt, verifyAdmin, async (req, res) => {
//       try {
//         const newPayment = req.body;
//         const result = await trainerPaymentsCollection.insertOne(newPayment);
//         res.send(result);
//       } catch (error) {
//         res
//           .status(500)
//           .send({ error: true, message: "There was a server side error" });
//       }
//     });

const TrainerPayment = mongoose.model('TrainerPayment', {})
    app.get("/trainer-payments",verifyJwt, verifyAdmin, async(req, res) => {
      try {
        const trainerPayments = await TrainerPayment.find({});
        res.send(trainerPayments);
      } catch (error) {
        res
          .status(500)
          .send({ error: true, message: "There was a server side error" });
      }
    });





// //Change payment status
//     app.patch("/change-payment-status/:trainerId", verifyJwt, verifyAdmin, async (req, res) => {
//       try {
//         const { trainerId } = req.params;
//         const filter = { _id: new ObjectId(trainerId) };
//         const updateDoc = {
//           $set: {
//             status: "paid",
//           },
//         };
//         const result = await trainersCollection.updateOne(filter, updateDoc, {
//           upsert: false,
//         });
//         res.send(result);
//       } catch (error) {
//         res
//           .status(500)
//           .send({ error: true, message: "There was a server side error" });
//       }
//     });
// //Create intent for payment
//     app.post("/create-payment-intent", verifyJwt, async (req, res) => {
//       const { price } = req.body;
//       if(price > 0){
//       const amount = parseInt(price * 100);

//       const paymentIntent = await stripe.paymentIntents.create({
//         amount: amount,
//         currency: "usd",
//         payment_method_types: ["card"],
//       });
//       res.send({
//        ret: paymentIntent cret,
//       });
//     }
//     });

//     /*================================== Booked Trainers Related APIs =================================*/
//     app.post("/booked-trainers", verifyJwt, async (req, res) => {
//       try {
//         const newBookedTrainer = req.body;
//         const result = await bookedTrainersCollection.insertOne(
//           newBookedTrainer
//         );
//         res.send(result);
//       } catch (error) {
//         res
//           .status(500)
//           .send({ error: true, message: "There was a server side error" });
//       }
//     });


const BookedTrainer = mongoose.model('BookedTrainer', {})
    app.get("/booked-trainers",verifyJwt, async (req, res) => {
      const query = req.query;
      try {
        const bookedItem = await BookedTrainer.findOne(query);
        res.send(bookedItem);
      } catch (error) {
        res
          .status(500)
          .send({ error: true, message: "There was a server side error" });
      }
    });


    app.get("/members-booked", async (req, res) => {
      const query = req.query;
      try {
        const membersBooked = await BookedTrainer.find(query);
        res.send(membersBooked);
      } catch (error) {
        res
          .status(500)
          .send({ error: true, message: "There was a server side error" });
      }
    });


  
//     /*================================== Classes Related APIs =================================*/
const Class = mongoose.model('Class', {})
    app.get("/classes", async (req, res) => {
      try {
        const classes = await Class.find({});
        res.send(classes);
      } catch (error) {
        res
          .status(500)
          .send({ error: true, message: "There was a server side error" });
      }
    });



    app.get("/classes/:classId", async (req, res) => {
      try {
        const classId = req.params.classId;
        const query = { _id: classId};

        const singleClass = await Class.findOne(query);
        res.send(singleClass);
      } catch (error) {
        res
          .status(500)
          .send({ error: true, message: "There was a server side error" });
      }
    });

//     app.post("/classes", async (req, res) => {
//       try {
//         const newClass = req.body;
//         const result = await classesCollection.insertOne(newClass);
//         res.send(result);
//       } catch (error) {
//         res
//           .status(500)
//           .send({ error: true, message: "There was a server side error" });
//       }
//     });


const Schedules = mongoose.model('Schedules', {})
    app.get("/schedules", async (req, res) => {
      try {
        const schedules = await Schedules.find({});
        res.send(schedules);
      } catch (error) {
        res
          .status(500)
          .send({ error: true, message: "There was a server side error" });
      }
    });


//     /*================================== Forums Related APIs =================================*/
  const Forum = mongoose.model('Forum', {})

    app.get("/forums", async (req, res) => {
      //pagination
      const page = parseInt(req.query.page);
      const size = parseInt(req.query.size);

      const result = await Forum
        .find({})
        .skip(page * size)
        .limit(size)
      res.send(result);
    });

//     app.put("/forums/:id", async (req, res) => {
//       try {
//         const email = req.body.email;
//         const forumId = req.params.id;
//         const query = { _id: new ObjectId(forumId) };

//         const forum = await forumsCollection.findOne(query);

//         if (forum?.likedBy === email) {
//           const updateDoc = {
//             $set: { likes: forum.likes - 1, likedBy: "" },
//           };

//           const result = await forumsCollection.updateOne(query, updateDoc, {
//             upsert: false,
//           });
//           res.send(result);
//           return;
//         }

//         const updateDoc = {
//           $set: { likes: forum.likes + 1, likedBy: email },
//         };
//         const result = await forumsCollection.updateOne(query, updateDoc, {
//           upsert: false,
//         });
//         res.send(result);
//       } catch (error) {
//         res
//           .status(500)
//           .send({ error: true, message: "There was a server side error" });
//       }
//     });

//     app.post("/forums", async (req, res) => {
//       try {
//         const newForum = req.body;
//         const result = await forumsCollection.insertOne(newForum);
//         res.send(result);
//       } catch (error) {
//         res
//           .status(500)
//           .send({ error: true, message: "There was a server side error" });
//       }
//     });

//     // users related apis
//     app.post("/users", async (req, res) => {
//       try {
//         const newUser = req.body;
//         const email = newUser.email;
//         const query = { email };

//         const isExist = await usersCollection.findOne(query);
//         //check if user already exist
//         if (!isExist) {
//           const result = await usersCollection.insertOne(newUser);
//           res.send(result);
//         }else{
//           res.send([])
//         }

//       } catch (error) {
//         res
//           .status(500)
//           .send({ error: true, message: "There was a server side error" });
//       }
//     });


  const User = mongoose.model("User", {})
    app.get("/users", async (req, res) => {
      try {
        const query = { email: req.query?.email };
        console.log(query)
        const loggedInUser = await User.findOne(query);
        console.log(loggedInUser)
        res.send(loggedInUser);
      } catch (error) {
        res
          .status(500)
          .send({ error: true, message: "There was a server side error" });
      }
    });

//     /*================================== Trainers Related APIs =================================*/
   const Trainer = mongoose.model("Trainer", {})
    app.get("/trainers", async (req, res) => {
      try {
        const trainers = await Trainer.find({});
        res.send(trainers);
      } catch (error) {
        res
          .status(500)
          .send({ error: true, message: "There was a server side error" });
      }
    });

    app.get("/trainers/:id", async (req, res) => {
      try {
        const trainerId = req.params.id;
        const query = { _id:trainerId};

        const trainer = await Trainer.findOne(query);
        res.send(trainer);
      } catch (error) {
        res
          .status(500)
          .send({ error: true, message: "There was a server side error" });
      }
    });


//     app.post("/trainers", async (req, res) => {
//       try {
//         const newTrainer = req.body;
//         const result = await trainersCollection.insertOne(newTrainer);
//         res.send(result);
//       } catch (error) {
//         res
//           .status(500)
//           .send({ error: true, message: "There was a server side error" });
//       }
//     });

    app.get("/applied-trainers",verifyAdmin, async (req, res) => {
      try {
        const query = req.query;
        const appliedTrainers = await Trainer.find(query);
        res.send(appliedTrainers);
      } catch (error) {
        res
          .status(500)
          .send({ error: true, message: "There was a server side error" });
      }
    });


//     app.patch("/trainers/:trainerId", async (req, res) => {
//       try {
//         const id = req.params.trainerId;
//         const filter = { _id: new ObjectId(id) };

//         const updateDoc = {
//           $set: { application: "accepted" },
//         };

//         const result = await trainersCollection.updateOne(filter, updateDoc, {
//           upsert: false,
//         });
//         res.send(result);
//       } catch (error) {
//         res
//           .status(500)
//           .send({ error: true, message: "There was a server side error" });
//       }
//     });

//     /*================================== Subscription Related APIs =================================*/
//     app.post("/subscriptions", async (req, res) => {
//       try {
//         const newSubscription = req.body;
//         const result = await subscriptionsCollection.insertOne(newSubscription);
//         res.send(result);
//       } catch (error) {
//         res
//           .status(500)
//           .send({ error: true, message: "There was a server side error" });
//       }
//     });
    const Subscription = mongoose.model('Subscription', {})
    app.get("/subscriptions", verifyJwt, verifyAdmin, async (req, res) => {
      try {
        const allSubscribers = await Subscription.find();
        res.send(allSubscribers);
      } catch (error) {
        res
          .status(500)
          .send({ error: true, message: "There was a server side error" });
      }
    });



app.listen(port, () => {
  console.log(`Fitness server is listening at port ${port}`);
});
