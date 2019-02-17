require("dotenv").config();
var Spotify = require("node-spotify-api");
var keys = require("./keys.js");
var inquirer = require("inquirer");
var axios = require("axios");
var fs = require('fs');
var spotify = new Spotify(keys.spotify);

var command = process.argv[2];
var originalInput = process.argv.slice(3).join(" ");
var parameter = process.argv.slice(3).join("+").trim();

if(parameter)
{
  if(command==="concert-this")
  {
    findConcerts(parameter);
  }
  else if(command==="spotify-this-song")
  {
    findSong(parameter);
  }
  else if(command==="movie-this")
  {
    // Search for a movie in the OMDB database.
  }
  else if(command==="do-what-it-says")
  {
    // Random search based on commands in the random.txt file.
  }
  else
  {
    console.log("You did not type in a valid command for LIRI. Please try again.\n");
    console.log("There are four different commands for LIRI.\n");
    console.log("1) node liri.js concert-this <insert artist name>\n");
    console.log("2) node liri.js spotify-this-song <insert song name with or without artist name>\n");
    console.log("3) node liri.js movie-this <insert movie name>\n");
    console.log("4) node liri.js do-what-it-says\n");
    console.log("Here is an example of how to use LIRI: 'node liri.js movie-this The Matrix'\n");
  }
}
else if(!command)
{
  console.log("You did not type in a valid command for LIRI. Please try again.\n");
  console.log("There are four different commands for LIRI.\n");
  console.log("1) node liri.js concert-this <insert artist name>\n");
  console.log("2) node liri.js spotify-this-song <insert song name with or without artist name>\n");
  console.log("3) node liri.js movie-this <insert movie name>\n");
  console.log("4) node liri.js do-what-it-says\n");
  console.log("Here is an example of how to use LIRI: 'node liri.js movie-this The Matrix'\n");
}
else
{
  if(command==="concert-this")
  {
    var randomLineNumber = Math.floor(Math.random() * 3) + 3;
    var data = fs.readFileSync("./random.txt","utf8");
    var lines = data.split("\n");
    var originalInputArray = lines[randomLineNumber].split('"');

    originalInput = originalInputArray[1].trim();
    parameter = originalInput.split(" ").join("+");

    console.log(`You aren't specifying an artist with the concert-this command. It's okay, I have selected this artist randomly for you: ${originalInput}.\n`);

    findConcerts(parameter);
  }
  else if(command==="spotify-this-song")
  {
    originalInput = "The Sign Ace of Base";
    parameter = originalInput.split(" ").join("+");

    console.log(`You aren't specifying a song with the spotify-this-song command. It's okay, I have selected this song for you: ${originalInput}.\n`);

    findSong(parameter);
  }
  else if(command==="movie-this")
  {
    // Search for a movie in the OMDB database.
    parameter = "Mr. Nobody";
  }
  else if(command==="do-what-it-says")
  {
    // Random search based on commands in the random.txt file.
  }
  else
  {
    console.log("You did not type in a valid command for LIRI. Please try again.\n");
    console.log("There are four different commands for LIRI.\n");
    console.log("1) node liri.js concert-this <insert artist name>\n");
    console.log("2) node liri.js spotify-this-song <insert song name with or without artist name>\n");
    console.log("3) node liri.js movie-this <insert movie name>\n");
    console.log("4) node liri.js do-what-it-says\n");
    console.log("Here is an example of how to use LIRI: 'node liri.js movie-this The Matrix'\n");
  }
}

function findConcerts(artistName)
{
  var URL = "https://rest.bandsintown.com/artists/"+artistName+"/events?app_id=codingbootcamp";

  axios.get(URL).then(function(response) {
    var jsonData = response.data;

    console.log(`Here are the next three concerts for ${originalInput}.\n`);

    for(var i=0;i<3;i++)
    {
      var timeStamp = jsonData[i].datetime.split("T");

      if(jsonData[i].venue.region != '')
      {
        console.log(`
          Concert ${i+1} Details:
          Venue: ${jsonData[i].venue.name}.
          Location: ${jsonData[i].venue.city}, ${jsonData[i].venue.region}.
          Country: ${jsonData[i].venue.country}.
          Date and Time: ${timeStamp[0]} at ${timeStamp[1]}.
        `);
      }
      else
      {
        console.log(`
          Concert ${i+1} Details:
          Venue: ${jsonData[i].venue.name}.
          City: ${jsonData[i].venue.city}.
          Country: ${jsonData[i].venue.country}.
          Date and Time: ${timeStamp[0]} at ${timeStamp[1]}.
        `);
      }
    }
  }).catch(function(error){
    console.log("\nThere was an error with this search result from the Bands in Town API. Here is the error:\n");
    console.log(error);
    console.log("\nCan you try using the concert-this command with a different artist?\n");
  });
}

function findSong(songName) 
{
  console.log(`Here is the song search result for ${originalInput}.`);

  spotify.search({
    type: 'track',
    query: songName,
    limit: 1
  },function (err, data) {
    if(err) 
    {
      console.log("\nThere was an error with this search result from the Spotify API. Here is the error:\n");
      console.log(err);
      console.log("\nCan you try using the spotify-this-song command with a different song?\n");
    }
    else
    {
      var artists = [];

      //for loop to populate the artists array in case there is more than one artist.
      for(var i=0;i<data.tracks.items[0].artists.length;i++)
      {
        artists.push(data.tracks.items[0].artists[i].name);
      }

      console.log(`
        Artist(s): ${artists.join(", ")}
        Song Name: ${data.tracks.items[0].name}
        Spotify Preview Link: ${data.tracks.items[0].preview_url}
        Album Name: ${data.tracks.items[0].album.name}
      `);
    }
  })
}
    // Append showData and the divider to log.txt, print showData to the console
    // fs.appendFile("log.txt", showData + divider, function(err) {
    //   if (err) throw err;
     
    // });