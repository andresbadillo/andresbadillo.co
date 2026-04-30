import React from "react";
import ReactDOM from "react-dom/client";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react";
import { HelmetProvider } from "react-helmet-async";
import { PostsProvider } from "@/context/PostsContext";
import { App } from "./App";
import "./styles/globals.scss";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <HelmetProvider>
      <PostsProvider>
        <App />
        <Analytics />
        <SpeedInsights />
      </PostsProvider>
    </HelmetProvider>
  </React.StrictMode>,
);
