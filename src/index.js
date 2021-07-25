import { StrictMode } from "react";
import ReactDOM from "react-dom";
import App from "./App";
import './github-ribbon.css';

const rootElement = document.getElementById("root");
ReactDOM.render(
  <StrictMode>
    <a
      className="gh-ribbon darkblue right"
      href="https://github.com/rohanBagchi/devto-testing"
      target="_blank"
    >
      View on GitHub!
    </a>
    <App />
  </StrictMode>,
  rootElement
);
