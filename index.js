const express = require('express')
const cors = require('cors')
const { MongoClient, ServerApiVersion } = require('mongodb');

require('dotenv').config()
const port = process.env.PORT || 8000

const app = express()

const corsOptions ={
    origin:['http://localhost:5173','http://localhost:5174', 'https://wufoo-university.netlify.app'],
    Credential:true,
    optionalSuccessStatus:200,
}

app.use(cors(corsOptions))
app.use(express.json())

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.cjbmdks.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;


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
    //   await client.connect();

    const offerCollection = client.db('wufooUniversity').collection('offerings')
    const courseCollection = client.db('wufooUniversity').collection('courses')
    const admissionCollection = client.db('wufooUniversity').collection('candidates')

    // Getting All Offers
    app.get('/offers', async(req,res) =>{
        const  result = await offerCollection.find().toArray()
        res.send(result)
    })

    // get all the courses
    app.get('/courses', async(req,res) =>{
        const  result = await courseCollection.find().toArray()
        res.send(result)
    })

    //  store all candidate data
    app.post('/candidates', async(req,res)=>{
        const candidateData = req.body;  
        
        const result = await admissionCollection.insertOne(candidateData);
        res.send(result)
    })

      // Send a ping to confirm a successful connection
      await client.db("admin").command({ ping: 1 });
      console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
      // Ensures that the client will close when you finish/error
    //   await client.close();
    }
  }
  run().catch(console.dir);

app.get('/', (req,res)=>{
    res.send('Hello From Server')
})

app.listen(port, ()=>console.log(`server Running on port ${port}`))