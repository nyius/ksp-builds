import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import CookieConsent from 'react-cookie-consent';
import ContextsProvider from './context/ContextProvider';
import PrivateRoute from './routes/PrivateRoute';
import PublicRoute from './routes/PublicRoute';
import AdminRoute from './routes/AdminRoute';
import backgroundplanet from './assets/planet.png';
import ScrollToTop from './routes/ScrollToTop';
//---------------------------------------------------------------------------------------------------//
import { Index, SignUp, Build, NotFound, Upload, Profile, Privacy, Terms, VisitProfile, Settings, News, Favorites, Contact, AdminPanel, Challenge, Challenges, Faq, PatchNotes, UnderConstruction, Sponsor } from './pages';
import RightBar from './components/containers/rightBar/RightBar';
//---------------------------------------------------------------------------------------------------//
import { Navbar, Footer } from './components';
import Stars from './components/stars/Stars';
import LeftBar from './components/containers/leftBar/LeftBar';
import Modals from './components/modals/Modals';
import Messaging from './components/Messaging/Messaging';
//---------------------------------------------------------------------------------------------------//
import 'react-toastify/dist/ReactToastify.css';
import './App.css';

/*TODO
build folders on personal profile
	drag and drop your own builds into a folder?
deleting comment popup to clarify
when launching the app, it should loop over the localstorage and check all of the stored builds to see their age
	if theyre older than like a week, they should be removed from storage
break apart loading the user in the context so that as soon as we first load the users profile, we set loading to false.
	create separate loading for notifs, convos, etc
clicking a username inside of a build card should go to the user, not the build
fix hover effect on builds card at 2k res
userprofiles should local store just like builds
builds fetched by ID need to be paginated. break them up into folders and then iterate over them
bundle craft together, multiple download buttons per folder
refactor all functions to be prettier/cleaner - move components into their own files, etc
make type searching work for your own builds/visiting a users builds
go through all JSX and remove all instances of && and replace with ?:
implement react-popper to replace tooltips and username hover
pagination allowing user to jump right to a page? might result in a large amount of firebase calls
thumbnails scale down
competitions/ways to give users accolades
t-shirts, merch
Volunteer positions (moderate, write posts, create challenges, etc) - this will include all the features they may need to see/have access to
twitch sidebar
discord
Quick share builds (without needing to create a whole build)
Mission generation page - would get destroyed by chatGPT charges so maybe in the future
create backup database on an entirely new firebase instance - updates once a week
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
						<CookieConsent flipButtons enableDeclineButton declineButtonText="Decline">
							This website uses cookies to enhance the user experience.
						</CookieConsent>
						<ToastContainer theme="dark" />

						{/* Main layout sizing */}
						<div className="main-container flex w-full justify-center mb-6 min-h-screen">
							{/* Content Layout*/}
							<div className="flex flex-col md:grid md:grid-cols-6 2k:grid-cols-8 gap-4 xl:gap-20 2k:gap-32 w-full mt-20 xl:mt-24 2k:mt-32">
								{/* xl:w-5/6  */}
								<div className="md:col-start-1 md:col-end-3 lg:col-end-2">
									<LeftBar />
								</div>
								{/* Center Content */}
								<div className="md:col-start-3 md:col-end-7 lg:col-start-2 xl:col-end-6 2k:col-end-8">
									<ScrollToTop />
									<Routes>
										<Route exact path="/" element={<Index />} />
										<Route exact path="/builds/:id" element={<Index />} />
										<Route exact path="/privacy" element={<Privacy />} />
										<Route exact path="/terms" element={<Terms />} />
										<Route exact path="/news" element={<News />} />
										<Route exact path="/faq" element={<Faq />} />
										<Route exact path="/sponsor" element={<Sponsor />} />
										<Route exact path="/contact" element={<Contact />} />
										<Route exact path="/challenges/:id" element={<Challenge />} />
										<Route exact path="/challenges" element={<Challenges />} />
										<Route exact path="/patch-notes" element={<PatchNotes />} />
										<Route exact path="/user/:id" element={<VisitProfile />} />
										<Route exact path="/user/:id/folder/:folderId" element={<VisitProfile />} />
										<Route exact path="/build/:id" element={<Build />} />
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
											path="/upload/:id"
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
						<Messaging />
						<Modals />
						<Footer />
					</div>
				</div>
			</ContextsProvider>
		</Router>
	);
}

export default App;
