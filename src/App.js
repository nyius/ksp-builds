import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import ContextsProvider from './context/ContextProvider';

import { Index, SignUp, Build, NotFound, Create, Profile, Privacy, Terms } from './pages';
import { Navbar, Footer } from './components';
import PrivateRoute from './routes/PrivateRoute';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './app.css';
import backgroundplanet from './assets/planet.png';
import Stars from './components/stars/Stars';
import RightBar from './pages/index/RightBar';
import LeftBar from './pages/index/LeftBar';
/*TODO
Build page
Commenting
Profile
responsive
uploading a build should add it to the users profile
search that searches the database, not just loaded builds
email account
privary policy
terms and conditions
News feed
Builds should get a gallery
youtube upload
 */

//---------------------------------------------------------------------------------------------------//
function App() {
	return (
		<Router>
			<ContextsProvider>
				<Stars />
				{/* background Styling */}
				<div className="gradient">
					<div className="planet" style={{ backgroundImage: `url("${backgroundplanet}")` }}>
						{/* Navbar/ notifications */}
						<Navbar />
						<ToastContainer theme="dark" />

						{/* Main layout sizing */}
						<div className="main-container flex w-full justify-center mb-6 min-h-screen">
							{/* Content Layout*/}
							<div className="grid grid-cols-6 gap-4 justify-center w-3/4 mt-20">
								<LeftBar />
								{/* Center Content */}
								<div className="col-start-2 col-end-6">
									<Routes>
										<Route exact path="/" element={<Index />} />
										<Route exact path="/sign-up" element={<SignUp />} />
										<Route
											exact
											path="/create"
											element={
												<PrivateRoute>
													<Create />
												</PrivateRoute>
											}
										/>
										<Route exact path="/privacy" element={<Privacy />} />
										<Route exact path="/terms" element={<Terms />} />
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
								</div>
								<RightBar />
							</div>
						</div>
						<Footer />
					</div>
				</div>
			</ContextsProvider>
		</Router>
	);
}

export default App;
