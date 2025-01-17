require('dotenv').config();

const express = require('express');
const hbs = require('hbs');

// require spotify-web-api-node package here:
const SpotifyWebApi = require('spotify-web-api-node');

const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

// setting the spotify-api goes here:
const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
  });
  
// Retrieve an access token
spotifyApi
    .clientCredentialsGrant()
    .then(data => spotifyApi.setAccessToken(data.body['access_token']))
    .catch(error => console.log('Something went wrong when retrieving an access token', error));

// Our routes go here:

//route to the index page
app.get('/', (req, res, next) => {
    res.render('index')
})

//route to the artists search
app.get('/artist-search', (req, res, next) => {

    spotifyApi.searchArtists(req.query.artistName)
    .then((data) => {
        const artists = data.body.artists.items;
        res.render('artist-search-results',{artists})
    })
    .catch((error) => {console.log('The error while searching artists occurred:', error)})
})

//route to get albums 
app.get("/albums/:artistId", (req,res)=>{

    spotifyApi.getArtistAlbums(req.params.artistId)
    .then(data => {
        const albums = data.body.items;
        res.render('albums',{albums})
    })
    .catch(error => console.log('The error while searching albums occurred:',error))
})

//route to tracks
app.get('/tracks/:albumId', (req, res, next) => {
  
    spotifyApi.getAlbumTracks(req.params.albumId)
    .then((data) => {
        const tracks = data.body.items;
        res.render('tracks', { tracks });
      })
      .catch((error) => console.log('The error while searching tracks occurred:', error));
  });



app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
