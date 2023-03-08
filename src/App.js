import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';

import ContextsProvider from './context/ContextProvider';
import PrivateRoute from './routes/PrivateRoute';
import PublicRoute from './routes/PublicRoute';
import backgroundplanet from './assets/planet.png';
//---------------------------------------------------------------------------------------------------//
import { Index, SignUp, Build, NotFound, Create, Profile, Privacy, Terms, VisitProfile } from './pages';
import RightBar from './components/containers/rightBar/RightBar';
//---------------------------------------------------------------------------------------------------//
import { Navbar, Footer } from './components';
import Stars from './components/stars/Stars';
import LeftBar from './components/containers/leftBar/LeftBar';
import Modals from './components/modals/Modals';
//---------------------------------------------------------------------------------------------------//
import 'react-toastify/dist/ReactToastify.css';
import './App.css';

/*TODO
youtube video bug???
notifications
user can upvote their own build
login check if account exists (email vs google signup)
login modal closing after signin with email
proper text edior for comments/bio/build desc/etc
something breaks when going to your profile after just making an account (something to do with seconds)
search that searches the database, not just loaded builds
privary policy
terms and conditions
News feed
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
							<div className="flex flex-col md:grid md:grid-cols-6 gap-4 w-full lg:w-3/4 mt-20 2k:mt-36 m-2">
								<LeftBar />
								{/* Center Content */}
								<div className="col-start-1 col-end-7 md:col-start-2 lg:col-end-6">
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
											path="/create"
											element={
												<PrivateRoute>
													<Create />
												</PrivateRoute>
											}
										/>
										<Route exact path="/privacy" element={<Privacy />} />
										<Route exact path="/terms" element={<Terms />} />
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
										<Route path="*" element={<NotFound />} />
									</Routes>
								</div>
								<RightBar />
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
