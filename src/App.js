import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';

import ContextsProvider from './context/ContextProvider';
import PrivateRoute from './routes/PrivateRoute';
import PublicRoute from './routes/PublicRoute';
import AdminRoute from './routes/AdminRoute';
import backgroundplanet from './assets/planet.png';
//---------------------------------------------------------------------------------------------------//
import { Index, SignUp, Build, NotFound, Upload, Profile, Privacy, Terms, VisitProfile, Settings, News, Favorites, Contact, AdminPanel, UnderConstruction } from './pages';
import RightBar from './components/containers/rightBar/RightBar';
//---------------------------------------------------------------------------------------------------//
import { Navbar, Footer } from './components';
import Stars from './components/stars/Stars';
import LeftBar from './components/containers/leftBar/LeftBar';
import Modals from './components/modals/Modals';
import Alerts from './components/alert/Alerts';
import Banner from './components/banner/Banner';
//---------------------------------------------------------------------------------------------------//
import 'react-toastify/dist/ReactToastify.css';
import './App.css';

/*TODO
search that searches the database, not just loaded builds
reporting
email verification?
Mission generation page
send notifications to all users (like news)
folders
Go to a user like /nyius
Mods are a list
FAQ Page
upload image for comments
button closing notifications tab when clicked
Quick share builds (without needing to create a whole build)
instead of infinitely loading builds, it should be pages <- maybe local store each page as we load them, so when going backwards it just fetches the local storeage
home page Builds should probably fetch by default view count 
Competitions for daily
'uses mods' filter
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
							<div className="flex flex-col md:grid md:grid-cols-6 gap-4 xl:gap-20 2k:gap-32 w-full mt-20 2k:mt-36 m-2">
								{/* xl:w-5/6  */}
								<div className="md:col-start-1 md:col-end-3 lg:col-end-2">
									<LeftBar />
								</div>
								{/* Center Content */}
								<div className="md:col-start-3 md:col-end-7 lg:col-start-2 xl:col-end-6">
									<Routes>
										<Route exact path="/" element={<Index />} />
										<Route exact path="/builds/:id" element={<Index />} />
										<Route
											exact
											path="/sign-up"
											element={
												<PublicRoute>
													<SignUp />
												</PublicRoute>
											}
										/>
										<Route
											exact
											path="/upload"
											element={
												<PrivateRoute>
													<Upload />
												</PrivateRoute>
											}
										/>
										<Route
											exact
											path="/settings"
											element={
												<PrivateRoute>
													<Settings />
												</PrivateRoute>
											}
										/>
										<Route exact path="/privacy" element={<Privacy />} />
										<Route exact path="/terms" element={<Terms />} />
										<Route exact path="/news" element={<News />} />
										<Route exact path="/contact" element={<Contact />} />

										<Route exact path="/profile/:id" element={<VisitProfile />} />
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
										<Route
											exact
											path="/favorites"
											element={
												<PrivateRoute>
													<Favorites />
												</PrivateRoute>
											}
										/>
										<Route
											exact
											path="/admin-panel"
											element={
												<AdminRoute>
													<AdminPanel />
												</AdminRoute>
											}
										/>
										<Route path="*" element={<NotFound />} />
									</Routes>
								</div>
								<div className="hidden xl:block">
									<RightBar />
								</div>
							</div>
						</div>
						<Modals />
						<Footer />
					</div>
				</div>
			</ContextsProvider>
		</Router>
	);
}

export default App;
