import React, { useState, useEffect } from "react";
import "./App.css";

function WebPlayback(props) {
  const [search, setSearch] = useState("");
  const [queue, setQueue] = useState([]);
  const [songs, setSongs] = useState([]);
  const [albumCover, setAlbumCover] = useState(null);
  const [setPlayer] = useState(undefined);
  const accessToken = props.token;

  useEffect(() => {
    if (!accessToken) return;
    const script = document.createElement("script");
    script.src = "https://sdk.scdn.co/spotify-player.js";
    script.async = true;

    document.body.appendChild(script);

    window.onSpotifyWebPlaybackSDKReady = () => {
      const player = new window.Spotify.Player({
        name: "Web Playback SDK",
        getOAuthToken: (cb) => {
          cb(accessToken);
        },
        volume: 0.5,
      });
      setPlayer(player);

      player.addListener("ready", ({ device_id }) => {
        console.log("Ready with Device ID", device_id);
      });

      player.addListener("not_ready", ({ device_id }) => {
        console.log("Device ID has gone offline", device_id);
      });

      player.connect();
    };
  }, [accessToken, setPlayer]);

  const searchSongs = async () => {
    if (!search || !accessToken) return;
    const response = await fetch(
      `https://api.spotify.com/v1/search?q=${search}&type=track&limit=10`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    const data = await response.json();
    setSongs(data.tracks.items);
  };

  const addToQueue = (song) => {
    setQueue([...queue, song]);
  };

  const playNextSong = () => {
    if (queue.length === 0) return;
    const [nextSong, ...rest] = queue;
    setQueue(rest);
    setAlbumCover(nextSong.album.images[0].url);
  };

  return (
    <div className="app">
      <header className="app-header">Virtual DJ</header>
      <div className="app-content">
        <div className="left-side"></div>
        <div className="right-side">
          <div className="right-side-left">
            <div className="album-cover">
              {albumCover && <img src={albumCover} alt="Album Cover" />}
            </div>
            <div className="search">
              <input
                type="text"
                placeholder="Search for songs on Spotify"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <button onClick={searchSongs}>Search</button>
            </div>
            <div className="songs">
              {songs.map((song) => (
                <div key={song.id} className="song">
                  {song.name} - {song.artists[0].name}
                  <button onClick={() => addToQueue(song)}>Add</button>
                </div>
              ))}
            </div>
          </div>
          <div className="right-side-right">
            <h2>Queue</h2>
            <div className="queue">
            {queue.map((song) => (
              <div key={song.id} className="queue-item">
                {song.name} - {song.artists[0].name}
              </div>
            ))}
          </div>
          <button onClick={playNextSong}>Play Next</button>
        </div>
      </div>
    </div>
  </div>
);
}

export default WebPlayback;
