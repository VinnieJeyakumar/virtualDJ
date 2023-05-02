import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import "./App.css";

const App = () => {
  const [search, setSearch] = useState("");
  const [queue, setQueue] = useState([]);

  const addToQueue = () => {
    setQueue([...queue, { id: uuidv4(), song: search }]);
    setSearch("");
  };

  return (
    <div className="app">
      <header className="app-header">Virtual DJ</header>
      <div className="app-content">
        <div className="left-side"></div>
        <div className="right-side">
          <div className="search">
            <input
              type="text"
              placeholder="Search for songs"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <button onClick={addToQueue}>Add</button>
          </div>
          <div className="queue">
            {queue.map((item) => (
              <div key={item.id} className="queue-item">
                {item.song}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
