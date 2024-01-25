import { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import CookieConsent from 'react-cookie-consent';
import ContextsProvider from './context/ContextProvider';
import PrivateRoute from './routes/PrivateRoute';
import PublicRoute from './routes/PublicRoute';
import AdminRoute from './routes/AdminRoute';
import ScrollToTop from './routes/ScrollToTop';
//---------------------------------------------------------------------------------------------------//
import { SpeedInsights } from '@vercel/speed-insights/react';
import { Analytics } from '@vercel/analytics/react';
//---------------------------------------------------------------------------------------------------//
import { Index } from './pages';
import backgroundplanet from './assets/planet.png';
import RightBar from './components/containers/rightBar/RightBar';
//---------------------------------------------------------------------------------------------------//
import { Navbar, Footer } from './components';
import Stars from './components/stars/Stars';
import LeftBar from './components/containers/leftBar/LeftBar';
import Modals from './components/modals/Modals';
import Messaging from './components/Messaging/Messaging';
import FullPageSpinner from './components/spinners/FullPageSpinner';
import FullContainer from './components/containers/FullContainer';
//---------------------------------------------------------------------------------------------------//
import 'react-toastify/dist/ReactToastify.css';
import './App.css';
import 'react-popper-tooltip/dist/styles.css';
import GridLayout from './components/containers/GridLayout';
import CenterContainer from './components/containers/CenterContainer';
import HangarBar from './components/containers/hangarBar/HangarBar';
import AlertBar from './components/alert/AlertBar';
import Article from './pages/news/Article';
import ModeratorRoute from './routes/ModeratorRoute';

const SignUp = lazy(() => import('./pages/sign/SignUp'));
const Login = lazy(() => import('./pages/sign/Login'));
const OverwolfLogin = lazy(() => import('./pages/sign/OverwolfLogin'));
const Build = lazy(() => import('./pages/build/Build'));
const NotFound = lazy(() => import('./pages/notFound/NotFound'));
const Upload = lazy(() => import('./pages/upload/Upload'));
const AccoladeDashboard = lazy(() => import('./pages/newAccolade/AccoladeDashboard'));
const Profile = lazy(() => import('./pages/profile/Profile'));
const ProfileAccolades = lazy(() => import('./pages/profile/ProfileAccolades'));
const Privacy = lazy(() => import('./pages/privacy/Privacy'));
const Terms = lazy(() => import('./pages/terms/Terms'));
const User = lazy(() => import('./pages/user/User'));
const UserAccolades = lazy(() => import('./pages/user/UserAccolades'));
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

/*NOTES
/*TODO
Asap---------------------------------------------------
- Make badges/acolades on each user account as an object to load icons/colors/hover etc
	- accolades builds fetch should localStore the last fetched time and only fetch again after X minutes
	- code each accolades conditional function
		-create actions for each check
		- daily challenge - Cant do this until daily challenges are implemented
		- mission control - Cant do this until daily challenges are implemented
	- accolade for first download (thats not from the current user)
	- accolade for first comment 
	- accolade for first hangar

-let users change hangar icons/colors
	- just for subscribers? (maybe free gets a few options of icons and no colors)
-fix hangars at bottom of screen not displaying right
-builds in a hanger should have a sort by date added filter
-Quick share builds (without needing to create a whole build)
-Overwolf

Whenever---------------------------------------------------
- local store notifs
- local store challenges/news
	- maybe have a master list of notifs/challenges that gets pulled first, checks for any new ones that arent in local store, and grabs only those from the server
- email notifs for botw
- make type searching work for your own builds/visiting a users builds
- convert website to look like app
-Code split everything
	-https://create-react-app.dev/docs/code-splitting/
-useEffect cleanup functions (lesson 154)
-Mission generation page - would get destroyed by chatGPT charges so maybe in the future
-Google ads
	-subscription tier to turn it off

Later---------------------------------------------------
- community voting for year end
Volunteer positions (moderate, write posts, create challenges, etc) - this will include all the features they may need to see/have access to
t-shirts, merch

Research---------------------------------------------------
- make the text editor less bad
pagination allowing user to jump right to a page? might result in a large amount of firebase calls
Should be able to login with username/password
	-automatically generate an email auth with the new username (eg steve@kspbuilds.com)
	-when the user signs in with username, stick @kspbuilds.com to the end and then attempt the email login
	
 */

//---------------------------------------------------------------------------------------------------//
function App() {
	return (
		<Router>
			<ContextsProvider>
				<Stars />
				<div className="planet" style={{ backgroundImage: `url("${backgroundplanet}")` }}>
					<Navbar />
					<AlertBar />
					<CookieConsent flipButtons enableDeclineButton declineButtonText="Decline">
						This website uses cookies to enhance the user experience.
					</CookieConsent>
					<SpeedInsights />
					<ToastContainer theme="dark" />

					<FullContainer>
						<GridLayout>
							<LeftBar />
							<CenterContainer>
								<Suspense fallback={<FullPageSpinner />}>
									<ScrollToTop />
									<Routes>
										<Route exact path="/" element={<Index />} />
										<Route exact path="/*" element={<Index />} />
										<Route exact path="/builds/:id" element={<Index />} />
										<Route exact path="/privacy" element={<Privacy />} />
										<Route exact path="/terms" element={<Terms />} />
										<Route exact path="/news" element={<News />} />
										<Route exact path="/news/:id" element={<Article />} />
										<Route exact path="/faq" element={<Faq />} />
										<Route exact path="/sponsor" element={<Sponsor />} />
										<Route exact path="/contact" element={<Contact />} />
										<Route exact path="/challenges/:id" element={<Challenge />} />
										<Route exact path="/challenges" element={<Challenges />} />
										<Route exact path="/patch-notes" element={<PatchNotes />} />
										<Route exact path="/user/:id" element={<User />} />
										<Route exact path="/user/:id/accolades" element={<UserAccolades />} />
										<Route exact path="/user/:id/hangar/:hangarId" element={<User />} />
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
											path="/login"
											element={
												<PublicRoute>
													<Login />
												</PublicRoute>
											}
										/>
										<Route exact path="/overwolf-login" element={<OverwolfLogin />} />
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
											path="/profile/accolades"
											element={
												<PrivateRoute>
													<ProfileAccolades />
												</PrivateRoute>
											}
										/>
										<Route
											exact
											path="/profile/hangar/:hangarId"
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
										<Route
											exact
											path="/accolade-dashboard"
											element={
												<ModeratorRoute>
													<AccoladeDashboard />
												</ModeratorRoute>
											}
										/>
										<Route
											exact
											path="/accolade-dashboard/:username"
											element={
												<ModeratorRoute>
													<AccoladeDashboard />
												</ModeratorRoute>
											}
										/>
										<Route path="*" element={<NotFound />} />
									</Routes>
								</Suspense>
							</CenterContainer>

							<HangarBar />
							<RightBar />
						</GridLayout>
					</FullContainer>
					<Messaging />
					<Modals />
					<Footer />
					<Analytics />
				</div>
			</ContextsProvider>
		</Router>
	);
}

export default App;
