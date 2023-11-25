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

//default routes
app.get('/', (req, res)=>{
    res.send(`Fitness server is running on port ${port}`)
})

const verifyJwt = (req, res, next)=>{
    console.log('Verify Jwt first!!!')
}

const verifyAdmin = (req, res, next)=>{
    
}


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

      app.get("/blogs", async(req, res)=>{
        try {
          const blogs = await blogsCollection.find({}).toArray();
           res.send(blogs) 
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


      app.get("/reviews", async(req, res)=>{
        try {
          const reviews = await reviewsCollection.find({}).toArray();
           res.send(reviews) 
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


