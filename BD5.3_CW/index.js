let express = require("express");
let app = express();
let {track}  = require("./models/track.model");
let {sequelize} = require("./lib/index");
app.use(express.json());

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

//Endpoint to add new data to the database table

async function addNewTrack(trackData) {
  let addedTrack = await track.create(trackData);
  return { addedTrack };
}

app.post("/tracks/new", async(req, res) => {
  try {
    let newTrack = req.body.newTrack;
    let response = await addNewTrack(newTrack);
    return res.status(200).json( response);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
  
});
//Endpoint to update the record

async function updateTrackById(updatedTrackData, id) {
  let trackDetails = await track.findOne({ where: { id }});
  if (!trackDetails) {
    return {};
  }

  trackDetails.set(updatedTrackData);
  let updatedTrack = await trackDetails.save();
  return {  message: "Track updated successfully", updatedTrack };
}

app.post("/tracks/update/:id", async (req,res) => {
  try {
    let newTrackData = req.body;
    let id = parseInt(req.params.id);
    let response = await updateTrackById(newTrackData, id);
    if(!response.message) {
      return res.status(404).json({ message: "Track not found."});
    }
    return res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ error: error.message});
  }
});

//Endpoint  to delete the record
async function deleteTrackById(id) {
  let destroyedTrack = await track.destroy({ where: { id }});
  if (destroyedTrack === 0) return {};
  return { message: "Track record deleted"};
}

app.post("/tracks/delete", async (req, res) => {
  try {
    let id = parseInt(req.body.id);
    let response = await deleteTrackById(id);

    if(!response.message) {
      return res.status(404).json({ message: "Track not found."});
    }
    return res.status(200).json(response);
  }catch (error) {
    res.status(500).json({error: error.message });
  }
});



app.listen(3000, () => {
  console.log("Server is running on port 3000");
});