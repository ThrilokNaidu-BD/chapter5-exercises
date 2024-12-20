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
      .json({ message: "Error  seedin the data", error: error.message});
  }
});

// Endpoints to Query on Database Table

async function fetchAllTracks() {
  let tracks = await track.findAll();
  return { tracks};
}

app.get("/tracks", async(req, res) => {
  try {
    let response = await fetchAllTracks();
    if (response.tracks.length === 0) {
      return res.status(404).json({ message: "No tracks found."});
    }
    return res.status(200).json(response);
  } catch(error) {
    res.status(500).json({error: error.message });
  }
});

async function fetchTrackById(id) {
  let trackData = await track.findOne({ where: {id}});
  return { track: trackData};
}

app.get("/tracks/details/:id", async(req, res) => {
  try {
    let id = parseInt(req.params.id);
    let result = await fetchTrackById(id);
    if (result.tracks === null) {
      return res.status(404).json({ error: "Track not found."});
    }
    return res.status(200).json(result);
  } catch(error) {
    res.status(500).json({error: error.message });
  }
});

async function fetchTrackByArtist(artist) {
  let tracks = await track.findAll({ where: {artist}});
  return { tracks: tracks};
}

app.get("/tracks/artist/:artist", async(req, res) => {
  try {
    let artist = req.params.artist;
    let result = await fetchTrackByArtist(artist);
    if (result.tracks.length === 0) {
      return res.status(404).json({ error: "Track not found."});
    }
    return res.status(200).json(result);
  } catch(error) {
    res.status(500).json({error: error.message });
  }
});

async function sortTrackByReleaseYear(order) {
  let sortedTracks = await track.findAll({ order: [["release_year", order]] });
  return { tracks: sortedTracks };
}

app.get("/tracks/sort/release_year", async(req, res) => {
  try {
    let order = req.query.order;
    let result = await sortTrackByReleaseYear(order);
    if (result.tracks.length === 0) {
      return res.status(404).json({ message: "No tracks found."});
    }
    return res.status(200).json(result);
  } catch(error) {
    res.status(500).json({error: error.message });
  }
});

app.get('/greet',(req,res) =>{
  const name = req.query.params.name;
  res.send("Hello", {name} +"!");
});



app.listen(3000, () => {
  console.log("Server is running on port 3000");
});