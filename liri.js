require("dotenv").config();
var Spotify = require("node-spotify-api");
var keys = require("./keys.js");
var axios = require("axios");
var fs = require('fs');
var spotify = new Spotify(keys.spotify);

var command = process.argv[2];
var originalInput = process.argv.slice(3).join(" ");
var parameter = process.argv.slice(3).join("+");
var logText;

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
    findMovie(parameter);
  }
  else if(command==="do-what-it-says")
  {
    if(parameter)
    {
      logText = "\nThe do-what-it-says command doesn't require a parameter so I removed all of the text after the command.\n";
      appendLogText();

      console.log(logText);
    }
    randomOriginalContent();
  }
  else
  {
    logText = "\nYou did not type in a valid command for LIRI. Please try again.\n\n";
    logText+="There are four different commands for LIRI.\n\n";
    logText+="1) node liri.js concert-this <insert artist name>\n";
    logText+="2) node liri.js spotify-this-song <insert song name with or without artist name>\n";
    logText+="3) node liri.js movie-this <insert movie name>\n";
    logText+="4) node liri.js do-what-it-says\n\n";
    logText+="Here is an example of how to use LIRI: 'node liri.js movie-this The Matrix'\n";
    appendLogText();

    console.log(logText);
  }
}
else if(!command)
{
  logText = "\nYou did not type in a valid command for LIRI. Please try again.\n\n";
  logText+="There are four different commands for LIRI.\n\n";
  logText+="1) node liri.js concert-this <insert artist name>\n";
  logText+="2) node liri.js spotify-this-song <insert song name with or without artist name>\n";
  logText+="3) node liri.js movie-this <insert movie name>\n";
  logText+="4) node liri.js do-what-it-says\n\n";
  logText+="Here is an example of how to use LIRI: 'node liri.js movie-this The Matrix'\n";
  appendLogText();

  console.log(logText);
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

    logText = `\nYou aren't specifying an artist with the concert-this command. It's okay, I have selected this artist randomly for you: ${originalInput}.\n`;
    appendLogText();

    console.log(logText);

    findConcerts(parameter);
  }
  else if(command==="spotify-this-song")
  {
    originalInput = "The Sign Ace of Base";
    parameter = originalInput.split(" ").join("+");

    logText = `\nYou aren't specifying a song with the spotify-this-song command. It's okay, I have selected this song for you: ${originalInput}.\n`;
    appendLogText();

    console.log(logText);

    findSong(parameter);
  }
  else if(command==="movie-this")
  {
    originalInput = "Mr. Nobody";
    parameter = originalInput.split(" ").join("+");

    logText = `\nYou aren't specifying a movie with the movie-this command. It's okay, I have selected this movie for you: ${originalInput}.\n`;
    appendLogText();

    console.log(logText);

    findMovie(parameter);
  }
  else if(command==="do-what-it-says")
  {
    randomOriginalContent();
  }
  else
  {
    logText = "\nYou did not type in a valid command for LIRI. Please try again.\n\n";
    logText+="There are four different commands for LIRI.\n\n";
    logText+="1) node liri.js concert-this <insert artist name>\n";
    logText+="2) node liri.js spotify-this-song <insert song name with or without artist name>\n";
    logText+="3) node liri.js movie-this <insert movie name>\n";
    logText+="4) node liri.js do-what-it-says\n\n";
    logText+="Here is an example of how to use LIRI: 'node liri.js movie-this The Matrix'\n";
    appendLogText();

    console.log(logText);
  }
}

function findConcerts(artistName)
{
  var URL = "https://rest.bandsintown.com/artists/"+artistName+"/events?app_id=codingbootcamp";

  axios.get(URL).then(function(response) {
    var jsonData = response.data;

    logText = `Here are the next three concerts for ${originalInput}.\n`;
    appendLogText();

    console.log(logText);

    for(var i=0;i<3;i++)
    {
      var timeStamp = jsonData[i].datetime.split("T");

      if(jsonData[i].venue.region != '')
      {
        logText = `Concert ${i+1} Details:\n`;
        logText+=`Venue: ${jsonData[i].venue.name}.\n`;
        logText+=`Location: ${jsonData[i].venue.city}, ${jsonData[i].venue.region}.\n`;
        logText+=`Country: ${jsonData[i].venue.country}.\n`;
        logText+=`Date and Time: ${timeStamp[0]} at ${timeStamp[1]}.\n`;
        appendLogText();

        console.log(logText);
      }
      else
      {
        logText = `Concert ${i+1} Details:\n`;
        logText+=`Venue: ${jsonData[i].venue.name}.\n`;
        logText+=`City: ${jsonData[i].venue.city}.\n`;
        logText+=`Country: ${jsonData[i].venue.country}.\n`;
        logText+=`Date and Time: ${timeStamp[0]} at ${timeStamp[1]}.\n`;
        appendLogText();

        console.log(logText);
      }
    }
  }).catch(function(error){
    logText = "\nThere was an error with this search result from the Bands in Town API. Here is the error:\n";
    logText+=error;
    logText+="\nCan you try using the concert-this command with a different artist?\n";
    appendLogText();

    console.log(logText);
  });
}

function findSong(songName) 
{
  logText = `Here is the song search result for ${originalInput}.\n`;
  appendLogText();

  console.log(logText);

  spotify.search({
    type: 'track',
    query: songName,
    limit: 1
  },function (error, data) {
    if(error) 
    {
      logText = "\nThere was an error with this search result from the Spotify API. Here is the error:\n";
      logText+=error;
      logText+="\nCan you try using the spotify-this-song command with a different song?\n";
      appendLogText();

      console.log(logText);
    }
    else
    {
      var artists = [];
      var previewLink;

      //for loop to populate the artists array in case there is more than one artist.
      for(var i=0;i<data.tracks.items[0].artists.length;i++)
      {
        artists.push(data.tracks.items[0].artists[i].name);
      }

      if(!data.tracks.items[0].preview_url)
      {
        previewLink = "No Preview link found on Spotify.";
      }
      else
      {
        previewLink = data.tracks.items[0].preview_url;
      }

      logText = `Artist(s): ${artists.join(", ")}\n`;
      logText+=`Song Name: ${data.tracks.items[0].name}\n`;
      logText+=`Spotify Preview Link: ${previewLink}\n`;
      logText+=`Album Name: ${data.tracks.items[0].album.name}\n`;
      appendLogText();

      console.log(logText);
    }
  })
}

function findMovie(movieName)
{
  var URL = "http://www.omdbapi.com/?t="+movieName+"&apikey=trilogy";

  axios.get(URL).then(function(response) {
    var jsonData = response.data;
    var rottenTomatoesRating;
    
    // for loop to find the Rotten Tomatoes key and then save the correct rating.
    for(var i=0;i<jsonData.Ratings.length;i++)
    {
      if(jsonData.Ratings[i].Source==="Rotten Tomatoes")
      {
        rottenTomatoesRating=jsonData.Ratings[i].Value;
      }
    }
    if(!rottenTomatoesRating)
    {
      rottenTomatoesRating="No Rotten Tomatoes Rating Found in the OMDB data.";
    }

    logText = `Here is the movie search result for ${originalInput}.\n\n`;
    logText+=`Title: ${jsonData.Title}\n`;
    logText+=`Year: ${jsonData.Year}\n`;
    logText+=`IMDB Rating: ${jsonData.imdbRating}\n`;
    logText+=`Rotten Tomatoes Rating: ${rottenTomatoesRating}\n`;
    logText+=`Production Country: ${jsonData.Country}\n`;
    logText+=`Language(s): ${jsonData.Language}\n`;
    logText+=`Plot: ${jsonData.Plot}\n`;
    logText+=`Actors: ${jsonData.Actors}\n`;
    appendLogText();

    console.log(logText);
  }).catch(function(error){
    logText = "\nThere was an error with this search result from the OMDB API. Here is the error:\n";
    logText+=error;
    logText+="\nCan you try using the movie-this command with a different movie?\n";
    appendLogText();

    console.log(logText);
  });
}

function randomOriginalContent()
{
  var lineNumber = Math.floor(Math.random() * 7);
  var data = fs.readFileSync("./random.txt","utf8");
  var lines = data.split("\n");
  var originalInputArray = lines[lineNumber].split('"');

  originalInput = originalInputArray[1].trim();
  parameter = originalInput.split(" ").join("+");

  if(originalInputArray[0]==="spotify-this-song,")
  {
    logText = `\nHere is your randomly generated command 'node liri.js spotify-this-song ${originalInput}'\n`;
    appendLogText();

    console.log(logText);

    findSong(parameter);
  }
  else
  {
    logText = `\nHere is your randomly generated command 'node liri.js concert-this ${originalInput}'\n`;
    appendLogText();

    console.log(logText);

    findConcerts(parameter);
  }
}

function appendLogText()
{
  var divider = "\n-----------------------------------------\n";
  fs.appendFile("log.txt",divider+logText,function(error) {
    if (error) throw error;
    
  });
}