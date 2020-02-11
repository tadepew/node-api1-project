import React, { useState, useEffect } from "react";
import axios from "axios";
import Card from "./components/Card";

function App() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    axios.get(`http://localhost:5000/api/users/`).then(res => {
      console.log(res);
      setUsers(res.data);
      console.log(res.data);
    });
  }, []);

  return (
    <div className="App">
      <h1>Users:</h1>
      <h3>Name ~ Bio</h3>
      {users.map(user => (
        <Card key={user.id} user={user} />
      ))}
    </div>
  );
}

export default App;
