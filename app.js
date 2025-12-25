const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyparser = require('body-parser');


const app = express();
const port = process.env.PORT || 3002;
let uri = "mongodb+srv://Mandeep:Mandeep2004@cluster0.8uejhos.mongodb.net/?appName=Cluster0";
app.use(cors({
    origin: "http://localhost:3000", 
    methods: ["GET", "POST"],
    credentials: true
}));

app.use(bodyparser.json());

const matchSchema = new mongoose.Schema({
    teamName1: String,
    teamName2: String,
    score: Number,
    wickets: Number,
    overs: String,
    result: String,
    date: { type: Date, default: Date.now }
});
const Match = mongoose.model('Match', matchSchema);

app.post("/save-match", async (req, res) => {
    try {
        const newMatch = new Match(req.body);
        await newMatch.save();
        res.status(200).send({ message: "Match saved successfully!" });
    } catch (err) {
        res.status(500).send(err);
    }
});

app.get("/get-matches", async (req, res) => {
    try {
        // Fetch all matches from MongoDB, sorted by newest first
        const matches = await Match.find().sort({ date: -1 });
        res.status(200).json(matches);
    } catch (err) {
        res.status(500).json({ message: "Error fetching matches", error: err });
    }
});


mongoose.connect(uri).then(()=>{
    console.log("MOngodb Is connected");
}).catch((err)=>console.log(err));


app.get("/Home",(req,res)=>{
    res.send("Home page");
})

app.listen(port, '0.0.0.0', () => { // Add '0.0.0.0' for Render
    console.log(`Server running on port ${port}`);
});