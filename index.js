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