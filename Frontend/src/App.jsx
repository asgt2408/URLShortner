import { useState } from "react";
import "./App.css";

function App() {
  const [selected, setSelected] = useState("");
  const [status, setStatus] = useState("No button clicked yet");
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");

  const handleButtonClick = (button) => {
    setSelected(button);
    setStatus(`Button ${button} clicked`);

    // Clear input and output
    setInput("");
    setOutput("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {

      if(selected=="A"){
        shortenURL();
      }
      else{
        decodeurl();
      }
    }
  };
  const shortenURL = async () => {
  try {
    const response = await fetch("http://127.0.0.1:8000/URLShortner/url_shorten", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        url_code: input,
      }),
    });

    const data = await response.json();

    setOutput(data.code);
  } catch (err) {
    console.error(err);
    setOutput("Server Error");
  }
};

const decodeurl = async () => {
  try {
    const response = await fetch(
      `http://127.0.0.1:8000/URLShortner/decode_url?code=${input}`
    );

    const data = await response.json();

    setOutput(data.URL);
  } catch (err) {
    console.error(err);
    setOutput("Server Error");
  }
};

  return (
    <div className="container">

      <div className="card">

        <h1 className="title">A / B Console</h1>

        <p className="subtitle">
          Click a button, type something, and see it mirrored below.
        </p>

        {/* Buttons */}

        <div className="button-group">

          <button
            className={`btn btn-a ${
              selected === "A" ? "active-a" : ""
            }`}
            onClick={() => handleButtonClick("A")}
          >
            URLShortner
          </button>

          <button
            className={`btn btn-b ${
              selected === "B" ? "active-b" : ""
            }`}
            onClick={() => handleButtonClick("B")}
          >
            Decode URL
          </button>

        </div>

        {/* Status */}

        <div className="status-box">

          <h3>Status</h3>

          <p>{status}</p>

        </div>

        {/* Input */}

        <div className="section">

          <label>Input</label>

          <input
            type="text"
            value={input}
            placeholder="Type something and press Enter..."
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
          />

        </div>

        {/* Output */}

        <div className="section">

          <label>Output</label>

          <div className="output-box">

            {output ? (
              output
            ) : (
              <span className="placeholder">
                Press Enter after typing...
              </span>
            )}

          </div>

        </div>

      </div>

    </div>
  );
}

export default App;