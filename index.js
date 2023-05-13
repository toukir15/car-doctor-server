const express = require('express')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors = require('cors')
const app = express()
const port = process.env.PORT || 5000;


// midlewere 
app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
    res.send('server is running');
})

// mongodb 
const uri = `mongodb+srv://carDoctor:iItXdO75Vyy3Sje5@cluster0.dgqtjig.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();

        const serviceCollection = client.db("carDoctor").collection('services');
        const checkoutCollection = client.db("carDoctor").collection('checkouts');
        // console.log(serviceCollection);

        app.get('/services', async (req, res) => {
            const cursor = serviceCollection.find();
            const result = await cursor.toArray();
            res.send(result)
        })

        app.get('/services/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: new ObjectId(id) }
            const result = await serviceCollection.findOne(query)
            res.send(result)
        })

        app.get('/checkouts', async (req, res) => {
            console.log(req.query);
            let query = {}
            if (req?.query.email) {
                query = { email: req.query.email }
            }
            const result = await checkoutCollection.find().toArray()
            // console.log(result);
            res.send(result)
        })

        app.post("/checkouts", async (req, res) => {
            const checkouts = req.body;
            console.log(checkouts);
            const result = await checkoutCollection.insertOne(checkouts)
            res.send(result)
        })

        app.delete('/checkouts/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await checkoutCollection.deleteOne(query)
            res.send(result)
        })

        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);


app.listen(port, () => {
    console.log(`server is running on port ${port}`);
})