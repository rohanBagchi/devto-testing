import "./styles.css";
import { useState } from "react";
import { get } from "axios";

const Status = {
  IDLE: 1,
  IN_PROGRESS: 2,
  ERROR: 3,
  SUCCESS: 4
};

export default function App() {
  const [joke, setJoke] = useState(null);
  const [error, setError] = useState(null);
  const [status, setStatus] = useState(Status.IDLE);

  const fetchJoke = async () => {
    try {
      setStatus(Status.IN_PROGRESS);
      const { data } = await get("https://api.icndb.com/jokes/random");
      if (data.type === "success") {
        setJoke(data?.value?.joke);
        setStatus(Status.SUCCESS);
      }
    } catch (e) {
      setError("Fetch failed. Please retry!");
      setStatus(Status.ERROR);
    }
  };

  const renderJoke = () => {
    if (status === Status.ERROR) {
      return <h3>{error}</h3>;
    }

    return <h3>{joke}</h3>;
  };

  return (
    <div className="App">
      <button onClick={fetchJoke} disabled={status === Status.IN_PROGRESS}>
        {status === Status.IN_PROGRESS ? "Loading ..." : "Get a random joke"}
      </button>

      {renderJoke()}
    </div>
  );
}
