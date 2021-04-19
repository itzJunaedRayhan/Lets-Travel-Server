const express = require('express')
const app = express()
const cors = require('cors')
app.use(cors())
const bodyParser = require('body-parser')
app.use(bodyParser.json())
require('dotenv').config()
const port = process.env.PORT || 3500;
const MongoClient = require('mongodb').MongoClient;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.42gqz.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
const ObjectID = require('mongodb').ObjectID;

app.get('/', (req, res) => {
  res.send('Hello World!')
})


client.connect(err => {
    const TravelCollection    = client.db("LetsTravel").collection("services");
    const BookingCollection   = client.db("LetsTravel").collection("bookings");
    const ReviewCollection    = client.db("LetsTravel").collection("reviews");
    const MakeAdminCollection = client.db("LetsTravel").collection("admin");
    //  Insert Services To Database
    app.post('/addProducts', (req,res)=>{
        const newService = req.body;
        TravelCollection.insertOne(newService)
        .then(result =>{
            res.send(result.insertedCount > 0)
        })
    })

//  Get All Services from Database
    app.get('/allServices', (req,res)=>{
        TravelCollection.find()
        .toArray((err, service)=>{
            res.send(service)
        })
    })

//  Find a Specific Service
    app.get('/services/:id', (req, res)=>{
        const id = ObjectID(req.params.id)
        TravelCollection.find({_id: id})
        .toArray((err, documents)=>{
            res.send(documents[0])
            console.log(documents[0])
        })
    })

//  Add Booked Order to Database
    app.post('/addBooking', (req, res)=>{
        const booking = req.body;
        BookingCollection.insertOne(booking)
        .then(result => {
            console.log(result.insertedCount)
            res.send(result.insertedCount > 0)
        })
    })

// get BookedList by Email
    app.post('/bookListByEmail', (req, res)=>{
        const email = req.body.email;
        BookingCollection.find({email : email})
        .toArray((err, result)=>{
            res.send(result)
        })
    })

//  add Reviews To Database
    app.post('/addReview', (req,res)=>{
        const newReview = req.body;
        ReviewCollection.insertOne(newReview)
        .then(result =>{
            res.send(result.insertedCount > 0)
        })
    })
//  Get Reviews From Database
    app.get('/reviews', (req,res)=>{
        ReviewCollection.find()
        .toArray((err, review)=>{
            res.send(review)
        })
    })

//  Get All Bookings
    app.get('/bookingList', (req,res)=>{
        BookingCollection.find()
        .toArray((err, review)=>{
            res.send(review)
        })
    })

//  delete
    app.delete('/delete/:id', (req, res) =>{
        const id = ObjectID(req.params.id)
        BookingCollection.deleteOne({_id: id})
        .then((result) => {
            res.send(result.deletedCount > 0);
        })
    })


//  make admin
    app.post('/makeAdmin', (req,res)=>{
        const NewAdmin = req.body;
        MakeAdminCollection.insertOne(NewAdmin)
        .then(result =>{
            res.send(result.insertedCount > 0)
        })
    })
    
//  is Admin ?
    app.post('/isAdmin', (req, res) => {
        const email = req.body.email;
        MakeAdminCollection.find({ email: email })
        .toArray((err, result) => {
            res.send(result.length > 0);
        })
    })

//  update
    app.patch('/update/:id', (req, res) => {
        BookingCollection.updateOne({_id: ObjectID(req.params.id)},
    {
        $set: {OrderStatus: req.body.status}
    })
    .then((result) => {
        res.send(result.modifiedCount > 0)
    })
})

});

app.listen(port, () => {console.log("Login Success")})