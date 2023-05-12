const loadSpotifySDK = (token) => {
    return new Promise((resolve) => {
        if (window.Spotify && window.Spotify.Player) {
            createPlayer(token, resolve);
        } else {
        window.onSpotifyWebPlaybackSDKReady = () => {
            createPlayer(token, resolve);
        };
        const script = document.createElement("script");
        script.src = "https://sdk.scdn.co/spotify-player.js";
        script.async = true;
        document.body.appendChild(script);
        }
    });
};
  
const createPlayer = (token, resolve) => {
    const player = new window.Spotify.Player({
        name: "Web Playback SDK",
        getOAuthToken: (cb) => {
            cb(token);
        },
        volume: 0.5,
    });
    resolve(player);
};

const searchSongs = async (search, accessToken) => {
    const response = await fetch(
        `https://api.spotify.com/v1/search?q=${search}&type=track&limit=7`,
        {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    });

    if (response.status === 401) {
        throw new Error('Unauthorized access token');
    } else if (!response.ok) {
        throw new Error(`Spotify API request failed with status ${response.status}`);
    }

    return await response.json();
};
  
const setActiveDevice = async (device_id, accessToken) => {
    await fetch("https://api.spotify.com/v1/me/player", {
        method: "PUT",
        headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            device_ids: [device_id],
            play: false,
        }),
    });
};
  
export { loadSpotifySDK, createPlayer, searchSongs, setActiveDevice };
  
  