import React from "react";
import Router from "./routes/Routes";
import './App.css';
import NavBar from "./components/navBar/NavBar";

function App() {
  return (
		<>
			<header>
				<NavBar />
			</header>

			<Router />
		</>
	);
}

export default App;
