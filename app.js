const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Train = require('./models/train'); // Import your Mongoose model
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = 3000;

// Configure Mongoose and connect to your MongoDB Atlas cluster
const mongoURI = 'mongodb+srv://test-user-1:NEpwTinCfkdmsonZ@cluster0.eyply9t.mongodb.net/?retryWrites=true&w=majority'; // Replace with your MongoDB Atlas connection string
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB Atlas');
});

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', async (req, res) => {
  try {
    const trains = await Train.find(); // Retrieve all trains from the database

    res.render('index', { trainData: { trains } }); // Pass the retrieved data to the rendered view
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/api/trains', async (req, res) => {
  try {
    const trains = await Train.find({}, '-_id -__v'); // Retrieve all trains from the database, excluding _id and __v

    const dates = {}; // Initialize an empty object for dates

    // Check if there is at least one train document
    if (trains.length > 0) {
      // Assuming dates are the same for all trains, so taking them from the first train
      dates.from_date = trains[0].from_date;
      dates.to_date = trains[0].to_date;
    }

    const responseData = {
      dates,
      trains,
    };

    res.json(responseData); // Send the data as JSON
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Handle POST requests
app.post('/submit', async (req, res) => {
  try {
    // Clear existing data by removing all documents in the collection
    await Train.deleteMany({});

    // Insert the new data from the request body
    const submittedData = req.body;
    const trains = submittedData.trains;
    const dates = submittedData.dates;

    // Store dates in the first train document
    if (trains.length > 0) {
      trains[0].from_date = dates.from_date;
      trains[0].to_date = dates.to_date;
    }

    await Train.insertMany(trains);

    res.status(200).send('Data submitted and saved to MongoDB.');
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal server error.');
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
