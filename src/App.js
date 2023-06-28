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
import { Index, SignUp, Build, NotFound, Upload, Profile, Privacy, Terms, User, Settings, News, Favorites, Contact, AdminPanel, Challenge, Challenges, Faq, PatchNotes, UnderConstruction, Sponsor } from './pages';
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
Add a 'group' when uploading a build that displays on the side
top hero should be news included, remove news from sidebar (make that just streams)
use useMemo to improve performance
go through all component props and set defaults if possible (like color = "#fff", size="24", etc)
check for things like {example ? "true" : "false"} and slim down
move all variables declared inside of a component  (that isnt involved with anything in that component) outside of the component
useEffects should only do 1 thing, split them up
useEffect cleanup functions
useEffects could be broken out into their own hooks for easier to read code and functionality (lesson 171/172)
drag and drop your own builds into a folder?
when launching the app, it should loop over the localstorage and check all of the stored builds to see their age
	if theyre older than like a week, they should be removed from storage
builds fetched by ID need to be paginated. break them up into folders and then iterate over them
twitch sidebar
	on 4k split banner with twitch streams?
	or show other slides hidden off to the side on left and right
	-firebase function to listen to all 'going live' events for verified twitch accounts (no faster than once per min)
	-push all live streams into an array on the DB (check what game theyre playing for KSP - may need to do multiple checks? or just let them go live with anything. Maybe listen to the KSP twitch category? scrape the page?)
	-remove from the array when they aren't live anymore
	
email notifs for botw
bundle craft together, multiple download buttons per folder
make type searching work for your own builds/visiting a users builds
implement react-popper to replace tooltips and username hover
pagination allowing user to jump right to a page? might result in a large amount of firebase calls
thumbnails scale down
competitions/ways to give users accolades/awards
t-shirts, merch
Volunteer positions (moderate, write posts, create challenges, etc) - this will include all the features they may need to see/have access to
Quick share builds (without needing to create a whole build)
switch to vite?
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
										<Route exact path="/*" element={<Index />} />
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
										<Route exact path="/user/:id" element={<User />} />
										<Route exact path="/user/:id/folder/:folderId" element={<User />} />
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
