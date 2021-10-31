const express = require('express')
const app = express()
const cors = require('cors')
require("dotenv").config()
const ObjectId = require("mongodb").ObjectId
const { MongoClient } = require("mongodb");
const port = process.env.PORT || 5000;


// middlewere
app.use(cors())
app.use(express.json())


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.krqaw.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


async function run() {
    try {
        await client.connect();
        const database = client.db('HeavenTrip')
        const packageCollection = database.collection("packages")
        const tripCollection = database.collection("trip")

        // post api for pakages
        app.post('/addpackage', async (req, res) => {
            const package = req.body;
            const result = await packageCollection.insertOne(package);
            res.send(result)
        })

        // get api for pakages
        app.get('/packages', async (req, res) => {
            const result = await packageCollection.find({}).toArray();
            res.send(result);
        })

        // get api for single pakage
        app.get('/packages/:id', async (req, res) => {
            const id = req.params.id
            const package = { _id: ObjectId(id) }
            const result = await packageCollection.findOne(package)
            res.send(result)
        })

        // post api for trip
        app.post('/booktrip', async (req, res) => {
            const trip = req.body;
            const result = await tripCollection.insertOne(trip);
            res.send(result)
        })


        //get api for trip 
        app.get('/trip', async (req, res) => {
            const result = await tripCollection.find({}).toArray();
            res.send(result);
        })

        // get api for dynamic email
        app.get('/trip/:email', async (req, res) => {
            const trips = { email: req.params.email }
            const result = await tripCollection.find(trips).toArray();
            res.send(result)
        })

        // trip delete api
        app.delete('/trip/:id', async (req, res) => {
            const id = req.params.id
            const trip = { _id: ObjectId(id) }
            const result = await tripCollection.deleteOne(trip)
            res.send(result);


        })

        // get api for manage trips
        app.get('/managetrips', async (req, res) => {
            const result = await tripCollection.find({}).toArray();
            res.send(result);
        })


        // status update api
        app.put('/trip/:id', async (req, res) => {
            const id = req.params.id;
            const trip = { _id: ObjectId(id) }
            const result = await tripCollection.updateOne(trip, {
                $set: {
                    status: "Approved"
                }
            })
            res.send(result);
        })

    } finally {
        // await client.close();
    }
}
run().catch(console.dir);



app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})