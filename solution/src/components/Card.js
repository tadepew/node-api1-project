import React from "react";
import axios from "axios";
import "./Card.css";

const Card = ({ user }) => {
  console.log(user);
  const deleteData = e => {
    e.preventDefault();
    axios.delete(`http://localhost:5000/api/users/${user.id}`);
  };

  return (
    <div className="users">
      {user.name} ~ {user.bio}
      <button onClick={deleteData}>delete</button>
    </div>
  );
};

export default Card;
