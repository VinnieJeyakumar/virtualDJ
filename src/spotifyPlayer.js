import React, { useState, useEffect } from 'react';

const SpotifyPlayer = ({ accessToken, trackUri }) => {
  const [player, setPlayer] = useState(null);

  useEffect(() => {
    if (!accessToken) return;
    if (!trackUri) return;

    const script = document.createElement('script');
    script.src = 'https://sdk.scdn.co/spotify-player.js';
    script.async = true;
    document.body.appendChild(script);

    const waitForSpotify = setInterval(() => {
      if (!window.Spotify) return;
      clearInterval(waitForSpotify);

      const newPlayer = new window.Spotify.Player({
        name: 'Virtual DJ',
        getOAuthToken: (cb) => cb(accessToken),
      });

      newPlayer.connect();

      setPlayer(newPlayer);
    }, 1000);
  }, [accessToken, trackUri]);

  useEffect(() => {
    if (!player || !trackUri) return;
    player._options.getOAuthToken((accessToken) => {
      fetch(`https://api.spotify.com/v1/me/player/play?device_id=${player._options.id}`, {
        method: 'PUT',
        body: JSON.stringify({ uris: [trackUri] }),
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
      });
    });
  }, [player, trackUri]);

  return null;
};

export default SpotifyPlayer;
