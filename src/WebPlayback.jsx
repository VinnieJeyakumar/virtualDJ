import React, { useState, useEffect, useCallback, useMemo } from "react";
import "./App.css";
import { loadSpotifySDK, searchSongs, setActiveDevice } from "./spotifyUtils";

function WebPlayback(props) {
  const [search, setSearch] = useState("");
  const [queue, setQueue] = useState([]);
  const [songs, setSongs] = useState([]);
  const [albumCover, setAlbumCover] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [player, setPlayer] = useState(undefined);
  const [playerReady, setPlayerReady] = useState(false);
  const [currentSongName, setCurrentSongName] = useState("");
  const [songDuration, setSongDuration] = useState(0);
  const [songProgress, setSongProgress] = useState(0);
  const accessToken = props.token;

  useEffect(() => {
    if (!accessToken) return;
    let isCancelled = false;
  
    const initializePlayer = async () => {
      try {
        const playerInstance = await loadSpotifySDK(accessToken);
        if (!isCancelled) {
          setPlayer(playerInstance);
    
          playerInstance.addListener("player_state_changed", (state) => {
            console.log("Playback state changed:", state);
    
            if (
              state.paused &&
              state.restrictions.disallow_resuming_reasons &&
              state.restrictions.disallow_resuming_reasons.length > 0
            ) {
              playNextSong();
            } else {
              setIsPlaying(!state.paused);
            }

            if (state.track_window && state.track_window.current_track) {
              const currentTrack = state.track_window.current_track;
              setCurrentSongName(`${currentTrack.name} - ${currentTrack.artists[0].name}`);
              setAlbumCover(currentTrack.album.images[0].url);
              setSongDuration(currentTrack.duration_ms);
            }
          });
    
          playerInstance.addListener("ready", async ({ device_id }) => {
            console.log("Ready with Device ID", device_id);
            setPlayerReady(true);
            setActiveDevice(device_id);
            playerInstance._options.id = device_id;
          });
    
          playerInstance.addListener("not_ready", ({ device_id }) => {
            console.log("Device ID has gone offline", device_id);
          });
    
          playerInstance.connect();
        } 
      } catch (error) {
        console.error('Error initializing player:', error);
      }
    };
  
    initializePlayer();
  
    return () => {
      isCancelled = true;
    };
  }, [accessToken]);
  
  useEffect(() => {
    if (!player || !playerReady) return;
  
    const updateProgress = async () => {
      if (!player) return;
      
      try {
        const state = await player.getCurrentState();
        if (state) {
          setSongProgress(state.position);
        }
      } catch (error) {
        console.error('Error updating progress:', error);
      }
    };
  
    const intervalId = setInterval(updateProgress, 10);
    return () => clearInterval(intervalId);
  }, [player, isPlaying, playerReady]);
  
  const playSong = useCallback(async (song) => {
    if (!player) return;
    setAlbumCover(song.album.images[0].url);
    setCurrentSongName(`${song.name} - ${song.artists[0].name}`);
    setSongDuration(song.duration_ms);
    try {
      await setActiveDevice(player._options.id);
      await fetch(`https://api.spotify.com/v1/me/player/play?device_id=${player._options.id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          uris: [song.uri],
          position_ms: 0,
        }),
      });
      setIsPlaying(true);
    } catch (error) {
      console.error('Error playing song:', error);
    }
  }, [accessToken, player]); 

  const playSongFromQueue = useCallback(async () => {
    if (queue.length === 0) return;

    const [song, ...rest] = queue;
    setQueue(rest);
    await playSong(song);
  }, [queue, playSong]);

  useEffect(() => {
    if (queue.length > 0 && !isPlaying) {
      playSongFromQueue();
    }
  }, [queue, isPlaying, playSongFromQueue]);
  
  const handleSearchSongs = useCallback(async () => {
    if (!search || !accessToken) return;
    try {
      const data = await searchSongs(search, accessToken);
      setSongs(data.tracks.items);
    } catch (error) {
      console.error('Error searching songs:', error);
      if (error.message === 'Unauthorized access token') {
        console.error('Unauthorized access token');
      } else {
        console.error('Other error');
      }
    }
  }, [search, accessToken]);

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      if (search.trim()) {
        handleSearchSongs();
      }
    }, 500);
  
    return () => {
      clearTimeout(debounceTimer);
    };
  }, [search, handleSearchSongs]);
  
  const addToQueue = useCallback((song) => {
    if (queue.length === 0 && !isPlaying) {
      setAlbumCover(song.album.images[0].url);
      setQueue([song]);
    }
    setQueue([...queue, song]);
  }, [queue, isPlaying]);

  const playNextSong = () => {
    if (queue.length === 0) {
      setCurrentSongName("");
      setAlbumCover(null);
      setIsPlaying(false);
      setSongProgress(0);
      if (player) {
        player.pause();
      }
    } else {
      playSongFromQueue();
    }
  };  

  const togglePlayPause = async () => {
    if (!player) return;
    try {
      if (!isPlaying) {
        if (queue.length > 0 && songProgress === 0) {
          playSongFromQueue();
        } else {
          await player.resume();
          setIsPlaying(true);
        }
      } else {
        await player.pause();
        setIsPlaying(false);
      }
    } catch (error) {
      console.error('Error toggling play/pause:', error);
    }
  };  
  
  const songList = useMemo(() => {
    return songs.map((song, index) => (
      <div key={`${song.id}-${index}`} className="song">
        {song.name} - {song.artists[0].name}
        <button onClick={() => addToQueue(song)}>+</button>
      </div>
    ));
  }, [songs, addToQueue]);
  
  const queueList = useMemo(() => {
    return queue.map((song, index) => (
      <div key={`${song.id}-${index}`} className="queue-item">
        {song.name} - {song.artists[0].name}
      </div>
    ));
  }, [queue]);


  return (
    <div className="app">
      <header className="app-header">
        <span className="app-header-text">Virtual DJ</span>
      </header>
      <div className="app-content">
        <div className="left-side"></div>
        <div className="right-side">
          <div className="right-side-left">
            <h2>Search</h2>
            <div className="search">
              <input
                type="text"
                placeholder="Search for songs on Spotify"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <button onClick={handleSearchSongs} disabled={!search.trim()}>Search</button>
            </div>
            <div className="songs">{songList}</div>
          </div>
          <div className="right-side-right">
            <div className="now-playing">
              <div className="album-cover">
                {albumCover && <img src={albumCover} alt="Album Cover" />}
              </div>
              <h3>Now playing: {currentSongName}</h3>
              <div className="progress-bar-container">
                <span className="current-time">
                  {Math.floor(songProgress / 60000)}:{((songProgress % 60000) / 1000).toFixed(0).padStart(2, "0")}
                </span>
                <progress className="progress-bar" value={songProgress} max={songDuration}></progress>
                <span className="total-time">
                  {Math.floor(songDuration / 60000)}:{((songDuration % 60000) / 1000).toFixed(0).padStart(2, "0")}
                </span>
              </div>
              <div className="queue-container">
                <h2>Queue</h2>
                <div className="queue">{queueList}</div>
              </div>
            </div>
            <div className="button-container">
              <button onClick={togglePlayPause}>{isPlaying ? '❚❚' : '▶'}</button>
              <button onClick={playNextSong}>Play Next</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default WebPlayback;