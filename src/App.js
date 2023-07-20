import { lazy, Suspense } from 'react';
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
import { Index } from './pages';
import RightBar from './components/containers/rightBar/RightBar';
//---------------------------------------------------------------------------------------------------//
import { Navbar, Footer } from './components';
import Stars from './components/stars/Stars';
import LeftBar from './components/containers/leftBar/LeftBar';
import Modals from './components/modals/Modals';
import Messaging from './components/Messaging/Messaging';
import FullPageSpinner from './components/spinners/FullPageSpinner';
//---------------------------------------------------------------------------------------------------//
import 'react-toastify/dist/ReactToastify.css';
import './App.css';
import 'react-popper-tooltip/dist/styles.css';

const SignUp = lazy(() => import('./pages/sign/SignUp'));
const Build = lazy(() => import('./pages/build/Build'));
const NotFound = lazy(() => import('./pages/notFound/NotFound'));
const Upload = lazy(() => import('./pages/upload/Upload'));
const Profile = lazy(() => import('./pages/profile/Profile'));
const Privacy = lazy(() => import('./pages/privacy/Privacy'));
const Terms = lazy(() => import('./pages/terms/Terms'));
const User = lazy(() => import('./pages/user/User'));
const Settings = lazy(() => import('./pages/settings/Settings'));
const News = lazy(() => import('./pages/news/News'));
const Favorites = lazy(() => import('./pages/favorites/Favorites'));
const Contact = lazy(() => import('./pages/contact/Contact'));
const AdminPanel = lazy(() => import('./pages/admin/AdminPanel'));
const Challenge = lazy(() => import('./pages/challenges/Challenge'));
const Challenges = lazy(() => import('./pages/challenges/Challenges'));
const Faq = lazy(() => import('./pages/faq/Faq'));
const PatchNotes = lazy(() => import('./pages/PatchNotes/PatchNotes'));
const Sponsor = lazy(() => import('./pages/sponsor/Sponsor'));

/*TODO
useEffect cleanup functions (lesson 154)
create a 'message popup' func that displays an error/success toast popup, as well as console logs the error
go through all component props and set defaults if possible (like color = "#fff", size="24", etc)
creating an account needs to have matching passwords. Also be much stricter on emails (needs @, etc)
use useMemo to improve performance
more space themed loading spinner
Change allowed folders to max like 5, then have users that support get access to unlimited folders (even level 1 support)
error reporting to server and logged
	-username (if one)
	-uid (if one)
	-url
	-Error
	-Action that caused error
drag and drop your own builds into a folder? 
	When on home page allow drag and drop of a build. Sidebar appears with folders in it
Should be able to login with username/password
	-automatically generate an email auth with the new username (eg steve@kspbuilds.com)
		-when the user signs in with username, stick @kspbuilds.com to the end and then attempt the email login
builds fetched by ID need to be paginated. break them up into folders and then iterate over them
create backup database on an entirely new firebase instance - updates once a week
email notifs for botw
make type searching work for your own builds/visiting a users builds
implement react-popper to replace tooltips and username hover
pagination allowing user to jump right to a page? might result in a large amount of firebase calls
competitions/ways to give users accolades/awards
Volunteer positions (moderate, write posts, create challenges, etc) - this will include all the features they may need to see/have access to
Quick share builds (without needing to create a whole build)
switch to vite?
Mission generation page - would get destroyed by chatGPT charges so maybe in the future
t-shirts, merch
 */

//---------------------------------------------------------------------------------------------------//
function App() {
	return (
		<Router>
			<Suspense fallback={<FullPageSpinner />}>
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
			</Suspense>
		</Router>
	);
}

export default App;
