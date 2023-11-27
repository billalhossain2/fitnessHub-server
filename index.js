const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
dotenv.config();
const jwt = require("jsonwebtoken");
const stripe = require("stripe")(process.env.PAYMENT_SECRET_KEY)

const app = express();
const port = process.env.PORT || 9000;

//Middlewares
app.use(cors({
    origin:["http://localhost:5173"],
    credentials:true
}));
app.use(express.json());


//JWT Routes
app.post("/set-cookie", (req, res)=>{
  const user = req.body;
  const token = jwt.sign(user, process.env.JWT_SECRET_KEY, {expiresIn:'1h'})
  console.log('Token', token)
  res.send({token})
})

//Custom middlewares
const verifyJwt = (req, res, next)=>{
  console.log('Verify Jwt first!!!')
  const data = req.headers;
  console.log("Headers data========> ", data)
  next()
}

const verifyAdmin = (req, res, next)=>{
  
}


//default routes
app.get('/', (req, res)=>{
    res.send(`Fitness server is running on port ${port}`)
})


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.0ak1okw.mongodb.net/?retryWrites=true&w=majority`;
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    },
  });


  async function run() {
    try {
      // Connect the client to the server	(optional starting in v4.7)
      // await client.connect();
      // Send a ping to confirm a successful connection
      // await client.db("admin").command({ ping: 1 });
      console.log("Pinged your deployment. You successfully connected to MongoDB!")
      const blogsCollection = client.db('fitnessDB').collection('blogs');
      const reviewsCollection = client.db('fitnessDB').collection('reviews');
      const featuresCollection = client.db('fitnessDB').collection('features');
      const teamCollection = client.db('fitnessDB').collection('team');
      const classesCollection = client.db('fitnessDB').collection('classes');
      const schedulesCollection = client.db('fitnessDB').collection('schedules');
      const forumsCollection = client.db('fitnessDB').collection('forums');
      const trainersCollection = client.db('fitnessDB').collection('trainers');
      const galleryCollection = client.db('fitnessDB').collection('gallery');

      const subscriptionsCollection = client.db('fitnessDB').collection('subscriptions');
      const usersCollection = client.db('fitnessDB').collection('users');
      const appliedTrainersCollection = client.db('fitnessDB').collection('appliedTrainers');

      app.get("/blogs", async(req, res)=>{
        try {
          const blogs = await blogsCollection.find({}).toArray();
           res.send(blogs) 
        } catch (error) {
          res.status(500).send({error:true, message:"There was a server side error"})
        }
      })

      app.get("/features", async(req, res)=>{
        try {
          const features = await featuresCollection.find({}).toArray();
           res.send(features) 
        } catch (error) {
          res.status(500).send({error:true, message:"There was a server side error"})
        }
      })


      app.get("/reviews", async(req, res)=>{
        try {
          const reviews = await reviewsCollection.find({}).toArray();
           res.send(reviews) 
        } catch (error) {
          res.status(500).send({error:true, message:"There was a server side error"})
        }
      })


      app.get("/team", async(req, res)=>{
        try {
          const team = await teamCollection.find({}).toArray();
           res.send(team) 
        } catch (error) {
          res.status(500).send({error:true, message:"There was a server side error"})
        }
      })

      /*================================== Classes Related APIs =================================*/
      app.get("/classes", async(req, res)=>{
        try {
          const classes = await classesCollection.find({}).toArray();
           res.send(classes) 
        } catch (error) {
          res.status(500).send({error:true, message:"There was a server side error"})
        }
      })

      app.get("/classes/:classId", async(req, res)=>{
        try {
          const classId = req.params.classId;
          const query = {_id:new ObjectId(classId)}

          const singleClass = await classesCollection.findOne(query);
           res.send(singleClass) 
        } catch (error) {
          res.status(500).send({error:true, message:"There was a server side error"})
        }
      })

      app.post("/classes", async(req, res)=>{
        try {
        const newClass = req.body;
        const result = await classesCollection.insertOne(newClass);
        res.send(result);
        } catch (error) {
          res.status(500).send({error:true, message:"There was a server side error"})
        }
      })


      app.get("/schedules", async(req, res)=>{
        try {
          const schedules = await schedulesCollection.find({}).toArray();
           res.send(schedules) 
        } catch (error) {
          res.status(500).send({error:true, message:"There was a server side error"})
        }
      })
 /*================================== Forums Related APIs =================================*/
      app.get("/forums", async(req, res)=>{
        //pagination
        const page = parseInt(req.query.page);
        const size = parseInt(req.query.size);

      const result = await forumsCollection.find()
      .skip(page * size)
      .limit(size)
      .toArray();
      res.send(result);
      })

      app.put("/forums/:id", async(req, res)=>{
        try {
          const email = req.body.email;
          const forumId = req.params.id;
          const query = {_id:new ObjectId(forumId)}

          const forum = await forumsCollection.findOne(query);

          console.log('user email======> ', email, 'forum email=========> ', forum.emails)
          console.log(email===forum.emails)

          if(forum?.emails===email){
          const updateDoc = {
              $set:{likes:forum.likes-1, emails:""}
            }

          const result = await forumsCollection.updateOne(query, updateDoc, {upsert:false});
          res.send(result) 
          return;
          }

          const updateDoc = {
            $set:{likes:forum.likes+1, emails:email}
          }
          const result = await forumsCollection.updateOne(query, updateDoc, {upsert:false});
          res.send(result) 

        } catch (error) {
          res.status(500).send({error:true, message:"There was a server side error"})
        }
      })

      app.post("/forums", async(req, res)=>{
        try {
        const newForum = req.body;
        const result = await forumsCollection.insertOne(newForum);
        res.send(result);
        } catch (error) {
          res.status(500).send({error:true, message:"There was a server side error"})
        }
      })

      app.get("/gallery", async(req, res)=>{
        try {
          const gallery = await galleryCollection.find({}).toArray();
           res.send(gallery) 
        } catch (error) {
          res.status(500).send({error:true, message:"There was a server side error"})
        }
      })


      // users related apis 
      app.post("/users", async(req, res)=>{
        try {

          const newUser = req.body;
          const email = newUser.email;
          const query = {email};

          const isExist = await usersCollection.findOne(query);

          //check if user already exist
          if(!isExist){
            const result = await usersCollection.insertOne(newUser);
            res.send(result);
          }
          res.send([])

          } catch (error) {
            res.status(500).send({error:true, message:"There was a server side error"})
          }
      })

      app.get("/users", async(req, res)=>{
        try {
          const query = {email:req.query?.email}
          const loggedInUser = await usersCollection.findOne(query);
          res.send({role:loggedInUser.role})
        } catch (error) {
          res.status(500).send({error:true, message:"There was a server side error"})
        }
      })

      //trainer related apis
      app.get("/trainers", async(req, res)=>{
        try {
          const trainers = await trainersCollection.find({}).toArray();
           res.send(trainers) 
        } catch (error) {
          res.status(500).send({error:true, message:"There was a server side error"})
        }
      })

      app.get("/trainers/:id", async(req, res)=>{
        try {
          const trainerId = req.params.id;
          const query = {_id:new ObjectId(trainerId)}

          const trainer = await trainersCollection.findOne(query);
           res.send(trainer) 
        } catch (error) {
          res.status(500).send({error:true, message:"There was a server side error"})
        }
      })

      app.post("/trainers", async(req, res)=>{
        try {
        const newTrainer = req.body;
        const result = await trainersCollection.insertOne(newTrainer);
        res.send(result);
        } catch (error) {
          res.status(500).send({error:true, message:"There was a server side error"})
        }
      })

      app.post("/applied-tainers", async(req, res)=>{
        try {
        const appliedTrainer = req.body;
        const result = await appliedTrainersCollection.insertOne(appliedTrainer);
        res.send(result);
        } catch (error) {
          res.status(500).send({error:true, message:"There was a server side error"})
        }
      })

      app.get("/applied-tainers", verifyJwt, async(req, res)=>{
        try {
          const appliedTrainers = await appliedTrainersCollection.find().toArray();
           res.send(appliedTrainers) 
        } catch (error) {
          res.status(500).send({error:true, message:"There was a server side error"})
        }
      })


      //Post Api to add data
      app.post("/subscriptions", async(req, res)=>{
        try {
        const newSubscription = req.body;
        const result = await subscriptionsCollection.insertOne(newSubscription);
        res.send(result);
        } catch (error) {
          res.status(500).send({error:true, message:"There was a server side error"})
        }
      })

    } finally {
      // Ensures that the client will close when you finish/error
      // await client.close();
    }
  }
  run().catch(console.dir);


app.listen(port, ()=>{
    console.log(`Fitness server is listening at port ${port}`)
})


