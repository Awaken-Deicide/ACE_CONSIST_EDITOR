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

app.get('/', (req, res) => {
  res.render('index', { numTrains: 1 }); // Pass initial number of trains to the template
});

app.post('/submit', (req, res) => {
  const formData = req.body;

  const dataDir = path.join(__dirname, 'data');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir);
  }

  const filePath = path.join(dataDir, 'train_data.json');

  fs.writeFileSync(filePath, JSON.stringify(formData, null, 2));

  res.send('Data submitted and saved to JSON file.');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});