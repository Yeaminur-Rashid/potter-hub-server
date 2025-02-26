const express = require('express');
const cors = require('cors');
const app = express();

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

require('dotenv').config();
 
const port = process.env.PORT || 4000 ;

// middleware 

app.use(cors())
app.use(express.json())



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.yefeng2.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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

    const serviceCollection = client.db('potters').collection('arts');
    const bookingCollection = client.db('potters').collection('bookings');
    const AllCollection = client.db('potters').collection('alldata');


    app.get('/arts', async (req, res) => {
      const cursor = serviceCollection.find();
      const result = await cursor.toArray();
      res.send(result);
  })

    app.get('/arts/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id.trim()) }

      const options = {
          // Include only the `title` and `imdb` fields in the returned document
          projection: { itemName: 1, price: 1, _id: 1, photoUrl: 1,
            subcategoryName:1,
            customization:1,
            shortDescription:1,
            rating:1,
            stockStatus:1,
            userName:1,
            userEmail:1,
             },
      };

      const result = await serviceCollection.findOne(query, options);
      res.send(result);
  })
    app.get('/alldata', async (req, res) => {
      const cursor = AllCollection.find();
      const result = await cursor.toArray();
      res.send(result);
  })

    app.get('/alldata/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id.trim()) }

      const options = {
          // Include only the `title` and `imdb` fields in the returned document
          projection: { itemName: 1, price: 1, _id: 1, photoUrl: 1,
            subcategoryName:1,
            customization:1,
            shortDescription:1,
            rating:1,
            stockStatus:1,
            userName:1,
            userEmail:1,
             },
      };

      const result = await AllCollection.findOne(query, options);
      res.send(result);
  })

  // bookings 
  app.get('/bookings', async (req, res) => {
    console.log(req.query.email);
    let query = {};
    if (req.query?.email) {
        query = { email: req.query.email }
    }
    const result = await bookingCollection.find(query).toArray();
    res.send(result);
}) 

app.post('/bookings', async (req, res) => {
  const booking = req.body;
  console.log(booking);
  const result = await bookingCollection.insertOne(booking);
  res.send(result);
});

app.patch('/bookings/:id', async (req, res) => {
  const id = req.params.id;
  const filter = { _id: new ObjectId(id) };
  const updatedBooking = req.body;
  console.log(updatedBooking);
  const updateDoc = {
      $set: {
          status: updatedBooking.status
      },
  };
  const result = await bookingCollection.updateOne(filter, updateDoc);
  res.send(result);
})

app.delete('/bookings/:id', async (req, res) => {
  const id = req.params.id;
  const query = { _id: new ObjectId(id) }
  const result = await bookingCollection.deleteOne(query);
  res.send(result);
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

app.get('/',(req,res) =>{
    res.send('Harry is running')
})


app.listen(port,() =>{
    console.log(`Running On ${port}`);
    
})