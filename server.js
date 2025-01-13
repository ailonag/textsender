const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(bodyParser.json());
app.use(cors());

// Connect to MongoDB
mongoose.connect('mongodb+srv://<username>:<password>@cluster0.mongodb.net/texts?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true });

const textSchema = new mongoose.Schema({
    user: String,
    text: String,
    color: String
});

const Text = mongoose.model('Text', textSchema);

// API endpoints
app.post('/texts', async (req, res) => {
    const { user, text, color } = req.body;
    const newText = new Text({ user, text, color });
    await newText.save();
    io.emit('newText', newText); // Emit an event to all connected clients
    res.send(newText);
});

app.get('/texts', async (req, res) => {
    const texts = await Text.find();
    res.send(texts);
});

app.delete('/texts', async (req, res) => {
    await Text.deleteMany();
    io.emit('clearTexts'); // Emit an event to all connected clients
    res.send({ message: 'All texts cleared' });
});

const port = process.env.PORT || 3000;
server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

io.on('connection', (socket) => {
    console.log('A user connected');
    socket.on('disconnect', () => {
        console.log('A user disconnected');
    });
});
