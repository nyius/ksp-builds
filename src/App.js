import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import { Index, SignUp, Build, NotFound, Create, Profile } from './pages';
import { Navbar } from './components';

import './app.css';

//---------------------------------------------------------------------------------------------------//
function App() {
	return (
		<Router>
			<Navbar />
			<Routes>
				<Route exact path="/" element={<Index />} />
				<Route exact path="/sign-up" element={<SignUp />} />
				<Route exact path="/create" element={<Create />} />
				<Route exact path="/profile/:id" element={<Profile />} />
				<Route exact path="/profile" element={<Profile />} />
				<Route exact path="/build/:id" element={<Build />} />
				<Route path="*" element={<NotFound />} />
			</Routes>
		</Router>
	);
}

export default App;
