const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, 'public')));

const trainDataPath = path.join(__dirname, 'data', 'train_data.json');
let trainData = [];

try {
  const rawData = fs.readFileSync(trainDataPath, 'utf-8');
  trainData = JSON.parse(rawData);
} catch (error) {
  console.error('Error reading train data:', error);
}

app.get('/', (req, res) => {
  // Filter out any empty or undefined entries from trainData
  const validTrainData = trainData.filter(train => {
    const isValidTrain = Object.values(train).some(value => value !== undefined && value !== '');
    return isValidTrain;
  });

  res.render('index', { trainData: validTrainData });
});

app.post('/submit', (req, res) => {
  const formData = req.body;

  const dataDir = path.join(__dirname, 'data');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir);
  }

  const filePath = path.join(dataDir, 'train_data.json');

  fs.writeFileSync(filePath, JSON.stringify(formData, null, 2));

  // Update the trainData variable with the latest data
  trainData = formData;

  res.send('Data submitted and saved to JSON file.');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
