const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyparser = require('body-parser');


const app = express();
const port = process.env.PORT || 3002;
let uri = "mongodb+srv://Mandeep:Mandeep2004@cluster0.8uejhos.mongodb.net/cricket?retryWrites=true&w=majority";
app.use(cors({
    origin: ["http://localhost:3000", "https://cricket-x5jp.onrender.com"], 
    methods: ["GET", "POST", "DELETE", "OPTIONS"], 
    credentials: true
}));

app.use(bodyparser.json());

const playerSchema = new mongoose.Schema({
    name: String,
    team: String, // e.g., "Team A" or "Team B"
    role: String  // e.g., "Batsman", "Bowler"
});
const Player = mongoose.model('Player', playerSchema);

const matchSchema = new mongoose.Schema({
  teamName1: String,
  teamName2: String,
  score: Number,
  wickets: Number,
  overs: String,
  result: String,
  fallOfWickets: Array,
  firstInningsScore: Number,
  fullScorecard: [
    {
      name: String,
      runs: Number,
      balls: Number,
      status: String
    }
  ],
  bowlingScorecard: [
    {
        name: String,
        runs: Number,
        balls: Number,
        wickets: Number
    }
],
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

app.get("/seed-players", async (req, res) => {
    const players = [
        { name: "Mandeep grewal", team: "Team A" },
        { name: "parag", team: "Team A" },
        { name: "dev", team: "Team B" },
        { name: "doctor", team: "Team B" },
        // ... add more as needed
    ];
    try {
        await Player.insertMany(players);
        res.send("Players seeded!");
    } catch (e) {
        res.status(500).send(e);
    }
});

app.get("/get-players", async (req, res) => {
    try {
        const players = await Player.find();
        res.status(200).json(players);
    } catch (err) {
        res.status(500).json({ message: "Error fetching players" });
    }
});


app.post("/add-player", async (req, res) => {
    try {
        const { name, team, role } = req.body; // Team is now passed from the frontend
        const newPlayer = new Player({ name, team, role });
        await newPlayer.save();
        res.status(201).json({ message: "Player added!", player: newPlayer });
    } catch (err) {
        res.status(500).json({ message: "Error", error: err });
    }
});
app.delete("/delete-player/:id", async (req, res) => {
    try {
        await Player.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "Player deleted" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
app.get("/get-matches", async (req, res) => {
    try {
        const matches = await Match.find().sort({ date: -1 }); // Newest matches first
        res.status(200).json(matches);
    } catch (err) {
        res.status(500).json({ message: "Error fetching matches" });
    }
});


mongoose.connect(uri)
  .then(() => console.log("✅ MongoDB Connected Successfully"))
  .catch((err) => {
    console.error("❌ MongoDB Connection Error:");
    console.error(err);
  });

app.get("/Home",(req,res)=>{
    res.send("Home page");
})

app.listen(port, '0.0.0.0', () => { // Add '0.0.0.0' for Render
    console.log(`Server running on port ${port}`);
});