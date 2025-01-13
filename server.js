const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(bodyParser.json());
app.use(cors());

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/texts', { useNewUrlParser: true, useUnifiedTopology: true });

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
    res.send(newText);
});

app.get('/texts', async (req, res) => {
    const texts = await Text.find();
    res.send(texts);
});

app.delete('/texts', async (req, res) => {
    await Text.deleteMany();
    res.send({ message: 'All texts cleared' });
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
