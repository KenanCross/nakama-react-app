import React, { useState, useEffect } from "react";
import seasonFilter from "../components/seasonFilter/seasonFilter";
import airingToday from "../components/airingToday/airingToday";


const Home: React.FC = () => {	

	return (
		<div className='container mx-auto'>
			<div className='mb-6'>
				<h4 className='mb-3'>Airing Today</h4>
				{ airingToday() }
			</div>
			<div>
				{seasonFilter()}
			</div>

			
		</div>
	);
};

export default Home;
