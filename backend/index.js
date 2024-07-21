const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

app.use(cors());
app.use(bodyParser.json());

mongoose.connect('mongodb://localhost/farmingdata', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const dataSchema = new mongoose.Schema({
  soilType: String,
  irrigationMethod: String,
  seedType: String,
  fertilizerUsed: String,
}, { timestamps: true });

const Data = mongoose.model('Data', dataSchema);

app.post('/api/data', async (req, res) => {
  const data = new Data(req.body);
  try {
    await data.save();
    io.emit('newData', data); // Emit new data event
    res.status(201).send(data);
  } catch (error) {
    res.status(400).send(error);
  }
});

app.get('/api/data', async (req, res) => {
  try {
    const data = await Data.find();
    res.send(data);
  } catch (error) {
    res.status(500).send(error);
  }
});

server.listen(5000, () => {
  console.log('Server running on port 5000');
});
