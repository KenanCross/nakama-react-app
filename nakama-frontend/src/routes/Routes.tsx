import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "../pages/home";
import Anime from "../pages/anime";
import NavBar from "../components/navBar/NavBar";

const Router: React.FC = () => {
	return (
		<>			
			<Routes>
				<Route path='/' element={<Home />} />
				<Route path='/anime/:id' element={<Anime />} />
			</Routes>
		</>
	);
		
		
};

export default Router;
