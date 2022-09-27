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

    // getting all doctors
    app.get("/doctors", async (req, res) => {
      const cursor = doctorsCollection.find({});
      const doctors = await cursor.toArray();
      res.send(doctors);
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

    app.get("/admin/:email", async (req, res) => {
      const email = req.params.email;
      const user = await usersCollection.findOne({ email: email });
      const isAdmin = user.role === true;
      res.send({ admin: isAdmin });
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
