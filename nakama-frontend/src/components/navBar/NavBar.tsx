import { Link } from "react-router-dom";
const NavBar = () => {
	return (
		<div className='navbar bg-neutral-950 text-neutral-content mb-12'>
			<Link to={`/`}>
				<button className='btn btn-ghost text-xl'>Nakama</button>
			</Link>
		</div>
	);
};

export default NavBar;
