const express = require("express");
const cors = require("cors");
require("dotenv").config();

const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

const port = process.env.PORT || 5000;
const app = express();

app.use(cors());
app.use(express.json());

//Server Connections
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@digital-healthcare.2b0em69.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    await client.connect();
    console.log("Database is connected.");

    const database = client.db("healthcaredb");
    const usersCollection = database.collection("users");
    const servicesCollection = database.collection("services");
    const doctorsCollection = database.collection("doctors");
    const reviewsCollection = database.collection("reviews");
    const appsCollection = database.collection("apps");

    // getting all users
    app.get("/users", async (req, res) => {
      const cursor = usersCollection.find({});
      const users = await cursor.toArray();
      res.send(users);
    });

    // getting all services
    app.get("/services", async (req, res) => {
      const cursor = servicesCollection.find({});
      const services = await cursor.toArray();
      res.send(services);
    });

    // getting single services by id
    app.get("/services/:productId", async (req, res) => {
      const id = req.params.productId;
      const query = { _id: ObjectId(id) };
      const singleService = await servicesCollection.findOne(query);
      res.send(singleService);
    });

    // getting single doctor by id
    app.get("/doctors/:doctorId", async (req, res) => {
      const id = req.params.doctorId;
      const query = { _id: ObjectId(id) };
      const singleDoctor = await doctorsCollection.findOne(query);
      res.send(singleDoctor);
    });

    // getting all doctors
    app.get("/doctors", async (req, res) => {
      const cursor = doctorsCollection.find({});
      const doctors = await cursor.toArray();
      res.send(doctors);
    });
    app.get("/doctos/:email", async (req, res) => {
      const email = req.params.email;
      const query = { email: email };
      const user = await doctorsCollection.findOne(query);
      //const isAdmin = user?.role ? true : false;
      res.json(user);
    });

    // getting all reviews
    app.get("/apps", async (req, res) => {
      const cursor = appsCollection.find({});
      const reviews = await cursor.toArray();
      res.send(reviews);
    });
    //adding new review
    app.post("/apps", async (req, res) => {
      const newReview = req.body;
      //console.log(email, decodedEmail);
      const reviews = await appsCollection.insertOne(newReview);
      res.json(reviews);
    });

    app.delete("/orders/:orderId", async (req, res) => {
      const id = req.params.orderId;
      const query = { _id: ObjectId(id) };
      const result = await appsCollection.deleteOne(query);
      res.send(result);
    });

    // getting all reviews
    app.get("/reviews", async (req, res) => {
      const cursor = reviewsCollection.find({});
      const reviews = await cursor.toArray();
      res.send(reviews);
    });

    // getting single user
    app.get("/users/:email", async (req, res) => {
      const email = req.params.email;
      //console.log(email, decodedEmail);
      const query = { email: email };
      const user = await usersCollection.findOne(query);
      //const isAdmin = user?.role ? true : false;
      res.json(user);
    });

    // creating new users
    app.put("/users", async (req, res) => {
      const user = req.body;
      const filter = { email: user.email };
      const options = { upsert: true };
      const updateDoc = { $set: user };
      const newUser = await usersCollection.updateOne(
        filter,
        updateDoc,
        options
      );
      res.json(newUser);
    });

    // getting all reviews
    app.get("/reviews", async (req, res) => {
      const cursor = reviewsCollection.find({});
      const reviews = await cursor.toArray();
      res.send(reviews);
    });
    //adding new review
    app.post("/reviews", async (req, res) => {
      const newReview = req.body;
      const email = newReview.email;
      //console.log(email, decodedEmail);
      const reviews = await reviewsCollection.insertOne(newReview);
      res.json(reviews);
    });
  } finally {
    // await client.close();
  }
}

run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Welcome to Digital Healthcare Database!");
});

app.listen(port, () => {
  console.log(`Listening at ${port}`);
});
