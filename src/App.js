import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import ContextsProvider from './context/ContextProvider';

import { Index, SignUp, Build, NotFound, Create, Profile } from './pages';
import { Navbar } from './components';
import PrivateRoute from './routes/PrivateRoute';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './app.css';

//---------------------------------------------------------------------------------------------------//
function App() {
	return (
		<Router>
			<ContextsProvider>
				<Navbar />
				<ToastContainer theme="dark" />
				<Routes>
					<Route exact path="/" element={<Index />} />
					<Route exact path="/sign-up" element={<SignUp />} />
					<Route exact path="/create" element={<Create />} />
					<Route exact path="/profile/:id" element={<Profile />} />
					<Route exact path="/build/:id" element={<Build />} />
					<Route
						exact
						path="/profile"
						element={
							<PrivateRoute>
								<Profile />
							</PrivateRoute>
						}
					/>
					<Route path="*" element={<NotFound />} />
				</Routes>
			</ContextsProvider>
		</Router>
	);
}

export default App;
