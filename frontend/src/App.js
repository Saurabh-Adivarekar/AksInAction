import React, { useState } from 'react';

// Get the backend URL from the environment variable
//const backendURL = "http://135.235.208.204:3000";
const backendURL = process.env.REACT_APP_BACKEND_URL;

 function App() {
  const [inputName, setInputName] = useState('');
  const [namesList, setNamesList] = useState([]);

  const handleNameChange = (e) => setInputName(e.target.value);

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch(`${backendURL}/api/save-name`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: inputName }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to save name');
        }
        return response.json();
      })
      .then(() => {
        setInputName('');
        fetchNames();
      })
      .catch((error) => console.error('Error saving name:', error));
  };

  const fetchNames = () => {
    fetch(`${backendURL}/api/get-names`)
      .then((response) => response.json())
      .then((names) => setNamesList(names))
      .catch((error) => console.error('Error fetching names:', error));
  };

  return (
    <div className="App">
      <h1>Enter Your Name</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={inputName}
          onChange={handleNameChange}
          placeholder="Enter your name"
          required
        />
        <button type="submit">Submit</button>
      </form>
      <h2>Names in the Database:</h2>
      <button onClick={fetchNames}>Reveal</button>
      <ul>
        {namesList.map((name, index) => (
          <li key={index}>{name}</li>
        ))}
      </ul>
    </div>
  );
}

export default App;
