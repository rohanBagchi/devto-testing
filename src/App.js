import "./styles.css";
import { useState } from "react";
import { get } from "axios";

export default function App() {
  const [joke, setJoke] = useState(null);
  const [error, setError] = useState(null);

  const fetchJoke = async () => {
    try {
      const { data } = await get("https://api.icndb.com/jokes/random");
      if (data.type === "success") {
        setJoke(data?.value?.joke);
        setError(null);
      }
    } catch (e) {
      setError("Fetch failed. Please retry!");
    }
  };

  const renderJoke = () => {
    if (error) {
      return <h3>{error}</h3>;
    }

    return <h3>{joke}</h3>;
  };

  return (
    <div className="App">
      <button onClick={fetchJoke}>Get a random joke</button>

      {renderJoke()}
    </div>
  );
}
