import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import ContextsProvider from './context/ContextProvider';

import { Index, SignUp, Build, NotFound, Create, Profile } from './pages';
import { Navbar } from './components';

import './app.css';

//---------------------------------------------------------------------------------------------------//
function App() {
	return (
		<Router>
			<ContextsProvider>
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
			</ContextsProvider>
		</Router>
	);
}

export default App;
