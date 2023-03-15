import React from 'react';
import { BrowserRouter, Routes, Route, Switch } from 'react-router-dom';

function App() {
	return (
		<BrowserRouter>
			<Switch>
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
			</Switch>
		</BrowserRouter>
	);
}
