import React from "react";
import ReactDOM from "react-dom/client";
import { HelmetProvider } from "react-helmet-async";
import { PostsProvider } from "@/context/PostsContext";
import { App } from "./App";
import "./styles/globals.scss";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <HelmetProvider>
      <PostsProvider>
        <App />
      </PostsProvider>
    </HelmetProvider>
  </React.StrictMode>,
);
