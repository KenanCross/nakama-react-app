import React from "react";
import Router from "./routes/Routes";
import Sidebar from "./components/sidebar";
import Carousel from "./components/carosel";
import './App.css';

function App() {
  return (
    <div>
      <Router />
      <Sidebar />
      <Carousel/>
    </div>
  );
}

export default App;
