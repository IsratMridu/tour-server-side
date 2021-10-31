const express = require('express');
const app = express();
const port = process.env.PORT || 5000;
const cors = require('cors');
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
require('dotenv').config();


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.mnesf.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });



async function run() {
    try {
      await client.connect();
      const database = client.db("Travel_Planner");
      const packages = database.collection("packages");
      const bookings = database.collection("bookings");
      // create a document to insert

    //   GET Packages API
    app.get('/packages', async (req,res)=>{
        const result = await packages.find({}).toArray();
        // console.log(result);
        res.send(result);
    })

    app.get('/order/:id', async (req,res)=>{
        const result = await packages.findOne({_id: ObjectId(req.params.id)});
        res.send(result);
    })
    app.get('/updateBooking/:id', async (req,res)=>{
        const result = await bookings.findOne({_id: ObjectId(req.params.id)});
        res.send(result);
    })

    app.put('/update/:id', async (req,res)=>{
      const filter = { _id: ObjectId(req.params.id) };

      const options = { upsert: true };

      const updateDoc = {
        $set: {
          userName: req.body.userName,
          userEmail: req.body.userEmail,
          phone: req.body.phone,
          address: req.body.address,
          country: req.body.country,
          capital: req.body.capital,
          places: req.body.places,
          description: req.body.description,
          orderStatus: req.body.orderStatus

        },
      };

      const result = await bookings.updateOne(filter, updateDoc, options);
      res.send(result);
        
    })

    app.post('/addUserOrder', async (req,res)=>{
      const result1 = await bookings.insertOne(req.body);
      res.send(result1);
    })

    app.get('/allOrders', async (req,res)=>{

      const result = await bookings.find({}).toArray();
      res.send(result);
    })

    app.delete('/deleteOrder/:id' , async (req,res)=>{
      const result = await bookings.deleteOne({_id: ObjectId(req.params.id)});
      res.send(result);
    })

    app.get('/myOrders/:name', async (req,res)=>{
      // console.log(req.params.name);
      const result = await bookings.find({userName: req.params.name}).toArray();
      res.send(result);
    })

    app.post('/addNewPackage', async (req,res)=>{
      // console.log(req.body);
      const result = await packages.insertOne(req.body);
      res.send(result);
    })

    
      
      
      
     
    } finally {
    //   await client.close();
    }
  }
  run().catch(console.dir);


app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Server Ready To Use');
  })
  
  app.listen(port, () => {
    console.log('Server Running At Port',port);
  })

