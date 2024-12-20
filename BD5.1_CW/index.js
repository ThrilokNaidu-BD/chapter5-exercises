let express = require("express");
let app = express();
let {track}  = require("./models/track.model");
let {sequelize} = require("./lib/index");

let movieData = [
  {
    name: "Raabta",
    genre: "Romantic",
    release_year: 2012,
    artist: "Arijit Singh",
    album: "AgentVinod",
    duration: 4,
  },
  {
    name: "RRR",
    genre: "Drama",
    release_year: 2013,
    artist: "Rahul",
    album: "komaram-Bheem",
    duration: 4,
  },
  {
    name: "Salaar",
    genre: "Action",
    release_year: 2012,
    artist: "DSP",
    album: "soryude",
    duration: 5,
  },
  {
    name: "Pushpa2",
    genre: "Romantic-Action",
    release_year: 2014,
    artist: "shekar",
    album: "chuseki",
    duration: 5,
  }

];

app.get("/seed_db", async(req, res) => {
  try {
    await sequelize.sync({ force: true});
    await track.bulkCreate(movieData);
    res.status(200).json({ message: "Database Seeding successful" });
  } catch (error) {
    res 
      .status(500)
      .json({ message: "Error  seeding the data", error: error.message});
  }
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});