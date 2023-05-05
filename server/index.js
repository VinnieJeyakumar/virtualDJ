const request = require('request');
const express = require('express')
const dotenv = require('dotenv');
const path = require('path');

const port = 5000

dotenv.config({ path: path.resolve(__dirname, '..', '.env') });

const spotify_client_id = process.env.REACT_APP_SPOTIFY_CLIENT_ID;
const spotify_client_secret = process.env.REACT_APP_SPOTIFY_CLIENT_SECRET;

var app = express();

const generateRandomString = function (length) {
    var text = '';
    var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for (var i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
};

app.get('/auth/login', (req, res) => {
    var scope = "streaming user-read-email user-read-private";
    var state = generateRandomString(16);

    var auth_query_parameters = new URLSearchParams({
    response_type: "code",
    client_id: spotify_client_id,
    scope: scope,
    redirect_uri: "http://localhost:3000/auth/callback",
    state: state,
    });

    res.redirect('https://accounts.spotify.com/authorize/?' + auth_query_parameters.toString());
});

let access_token = '';

app.get('/auth/callback', (req, res) => {
    const code = req.query.code;
    const authOptions = {
      url: 'https://accounts.spotify.com/api/token',
      form: {
        code: code,
        redirect_uri: "http://localhost:3000/auth/callback",
        grant_type: 'authorization_code'
      },
      headers: {
        'Authorization': 'Basic ' + (Buffer.from(spotify_client_id + ':' + spotify_client_secret).toString('base64')),
        'Content-Type' : 'application/x-www-form-urlencoded'
      },
      json: true
    };
  
    request.post(authOptions, function(error, response, body) {
      if (!error && response.statusCode === 200) {
        access_token = body.access_token;
        res.redirect('http://localhost:3000');
      }
    });
});
  
app.get('/auth/token', (req, res) => {
    res.json({
      access_token: access_token
    });
});  

app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}`)
})
