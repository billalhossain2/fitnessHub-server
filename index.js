const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();
const jwt = require("jsonwebtoken");

const stripe = require("stripe")(process.env.PAYMENT_SECRET_KEY);

const verifyJwt = require('./Middlewares/verifyJwt')
const verifyAdmin = require('./Middlewares/verifyAdmin')

const app = express();
const port = process.env.PORT || 9000;

//Built-in Middlewares
app.use(
  cors({
    origin: ["https://fitnesshub-3f0fd.web.app"],
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


//default routes
app.get("/", (req, res) => {
  res.send(`Fitness server is running on port ${port}`);
});

//Connect to database using mongoose
mongoose
  .connect(
    `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.0ak1okw.mongodb.net/fitnessDB?retryWrites=true&w=majority`
  )
  .then(() => {
    console.log("FitnessHub server connection was successful");
  })
  .catch((error) => {
    console.log("FitnessHub server connection=====> ", error);
  });


  /*=======================Create intent for payment=================*/
  app.post("/create-payment-intent", verifyJwt, async (req, res) => {
    const { price } = req.body;
    if(price > 0){
    const amount = parseInt(price * 100);

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount,
      currency: "usd",
      payment_method_types: ["card"],
    });
    res.send({
     clientSecret: paymentIntent.client_secret,
    });
  }
  });



const Blog = mongoose.model("Blog", {});

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


const Feature = mongoose.model("Feature", {});

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

const Review = mongoose.model("Review", {});

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

const Team = mongoose.model("Team", {});

app.get("/team", async (req, res) => {
  try {
    const team = await Team.find();
    res.send(team);
  } catch (error) {
    res
      .status(500)
      .send({ error: true, message: "There was a server side error" });
  }
});

const Gallerie = mongoose.model("Gallerie", {});

app.get("/gallery", async (req, res) => {
  try {
    const galleries = await Gallerie.find();
    res.send(galleries);
  } catch (error) {
    res
      .status(500)
      .send({ error: true, message: "There was a server side error" });
  }
});

/*================================== Payment  Related APIs =================================*/
const BookedPayment = mongoose.model("BookedPayment", {
  name: String,
  email: String,
  transactionId: String,
  date: Date,
  price: Number,
});
app.post("/booking-payments", verifyJwt, async (req, res) => {
  try {
    const newPayment = req.body;
    const result = await BookedPayment.create(newPayment);
    res.send(result);
  } catch (error) {
    res
      .status(500)
      .send({ error: true, message: "There was a server side error" });
  }
});

app.get("/booking-payments", verifyJwt, async (req, res) => {
  try {
    const bookingPayments = await BookedPayment.find({});
    res.send(bookingPayments);
  } catch (error) {
    res
      .status(500)
      .send({ error: true, message: "There was a server side error" });
  }
});

const TrainerPayment = mongoose.model("TrainerPayment", {
  name: String,
  email: String,
  transactionId: String,
  date: Date,
  paidAmount: Number,
});

app.post("/trainer-payments", verifyJwt, verifyAdmin, async (req, res) => {
  try {
    const newPayment = req.body;
    const result = await TrainerPayment.create(newPayment);
    res.send(result);
  } catch (error) {
    res
      .status(500)
      .send({ error: true, message: "There was a server side error" });
  }
});

app.get("/trainer-payments", verifyJwt, verifyAdmin, async (req, res) => {
  try {
    const trainerPayments = await TrainerPayment.find({});
    res.send(trainerPayments);
  } catch (error) {
    res
      .status(500)
      .send({ error: true, message: "There was a server side error" });
  }
});

/*================================== Booked Trainers Related APIs =================================*/
const BookedTrainer = mongoose.model("BookedTrainer", {
  plan: String,
  classes: Array,
  facilities: Array,
  price: Number,
  bookedSlot: String,
  trainerEmail: String,
  trainerId: String,
  trainerName: String,
  memberEmail: String,
  memberName: String,
});

app.post("/booked-trainers", verifyJwt, async (req, res) => {
  try {
    const newBookedTrainer = req.body;
    const result = await BookedTrainer.create(newBookedTrainer);
    res.send(result);
  } catch (error) {
    res
      .status(500)
      .send({ error: true, message: "There was a server side error" });
  }
});

app.get("/booked-trainers", verifyJwt, async (req, res) => {
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

app.get("/members-booked", verifyJwt, async (req, res) => {
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

/*================================== Classes Related APIs =================================*/
const Class = mongoose.model("Class", {
  instructor: String,
  category: String,
  location: String,
  price: Number,
  startDate: String,
  startTime: String,
  classTitle: String,
  description: String,
  image: String,
});

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
    const query = { _id: classId };

    const singleClass = await Class.findOne(query);
    res.send(singleClass);
  } catch (error) {
    res
      .status(500)
      .send({ error: true, message: "There was a server side error" });
  }
});

app.post("/classes", async (req, res) => {
  try {
    const newClass = req.body;
    const result = await Class.create(newClass);
    res.send(result);
  } catch (error) {
    res
      .status(500)
      .send({ error: true, message: "There was a server side error" });
  }
});

const Schedules = mongoose.model("Schedules", {});
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

/*================================== Forums Related APIs =================================*/
const Forum = mongoose.model("Forum", {
  title: String,
  content: String,
  author: String,
  date: String,
  image: String,
  likes: Number,
  likedBy: String,
  postedBy: String,
});

app.get("/forums", async (req, res) => {
  //pagination
  const page = parseInt(req.query.page);
  const size = parseInt(req.query.size);

  const result = await Forum.find({})
    .skip(page * size)
    .limit(size);
  res.send(result);
});

    app.put("/forums/:id", async (req, res) => {
      try {
        const email = req.body.email;
        const forumId = req.params.id;
        const query = { _id:forumId};

        const forum = await Forum.findOne(query);

        if (forum?.likedBy === email) {
          const updateDoc = {
            $set: { likes: forum.likes - 1, likedBy: "" },
          };

          const result = await Forum.updateOne(query, updateDoc, {
            upsert: false,
          });
          res.send(result);
          return;
        }

        const updateDoc = {
          $set: { likes: forum.likes + 1, likedBy: email },
        };
        const result = await Forum.updateOne(query, updateDoc, {
          upsert: false,
        });
        res.send(result);
      } catch (error) {
        res
          .status(500)
          .send({ error: true, message: "There was a server side error" });
      }
    });

    app.post("/forums", async (req, res) => {
      try {
        const newForum = req.body;
        const result = await Forum.create(newForum);
        res.send(result);
      } catch (error) {
        res
          .status(500)
          .send({ error: true, message: "There was a server side error" });
      }
    });

   /*============================= Users related apis ===========================*/
const User = mongoose.model("User", {
  name: String,
  email: String,
  photoUrl: String,
  role: String,
});

app.post("/users", async (req, res) => {
  try {
    const newUser = req.body;
    const email = newUser.email;
    const query = { email };

    const isExist = await User.findOne(query);
    //check if user already exist
    if (!isExist) {
      const result = await User.create(newUser);
      res.send(result);
    } else {
      res.send([]);
    }
  } catch (error) {
    res
      .status(500)
      .send({ error: true, message: "There was a server side error" });
  }
});

app.get("/users", async (req, res) => {
  try {
    const query = { email: req.query?.email };
    console.log(query);
    const loggedInUser = await User.findOne(query);
    console.log(loggedInUser);
    res.send(loggedInUser);
  } catch (error) {
    res
      .status(500)
      .send({ error: true, message: "There was a server side error" });
  }
});

 /*================================== Trainers Related APIs =================================*/
const Trainer = mongoose.model("Trainer", {
  name: String,
  email: String, // Email is read-only
  phone: String,
  age: String,
  experience: String,
  specialization: String,
  joined_date: String,
  salary: String,
  skills: Array,
  availableTimeWeek: Array,
  available_slots: Array,
  application: String,
  image: String,
  totalSlots: Number,
  status:String,
});

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
    const query = { _id: trainerId };

    const trainer = await Trainer.findOne(query);
    res.send(trainer);
  } catch (error) {
    res
      .status(500)
      .send({ error: true, message: "There was a server side error" });
  }
});

app.post("/trainers", async (req, res) => {
  try {
    const newTrainer = req.body;
    const result = await Trainer.create(newTrainer);
    res.send(result);
  } catch (error) {
    res
      .status(500)
      .send({ error: true, message: "There was a server side error" });
  }
});

app.get("/applied-trainers", verifyJwt, verifyAdmin, async (req, res) => {
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


//Change application status of a trainer
app.patch("/trainers/:trainerId", async (req, res) => {
  try {
    const id = req.params.trainerId;
    const filter = { _id: id };

    const updateDoc = { application: "accepted" }


    const result = await Trainer.updateOne(filter, updateDoc);
    res.send(result);
  } catch (error) {
    res
      .status(500)
      .send({ error: true, message: "There was a server side error" });
  }
});


//Change payment status of a trainer
    app.patch("/change-payment-status/:trainerId", verifyJwt, verifyAdmin, async (req, res) => {
      try {
        const { trainerId } = req.params;
        const filter = { _id: trainerId };
        const updateDoc = {status:"paid"};

        const result = await Trainer.updateOne(filter, updateDoc);
        console.log("Changed Payment Status")

        res.send(result);
      } catch (error) {
        res
          .status(500)
          .send({ error: true, message: "There was a server side error" });
      }
    });

/*================================== Subscription Related APIs =================================*/
const Subscription = mongoose.model("Subscription", {
  name: String,
  email: String,
});

app.post("/subscriptions", async (req, res) => {
  try {
    const newSubscription = req.body;
    const result = await Subscription.create(newSubscription);
    res.send(result);
  } catch (error) {
    res
      .status(500)
      .send({ error: true, message: "There was a server side error" });
  }
});

app.get("/subscriptions",verifyJwt, verifyAdmin, async (req, res) => {
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
