import React from 'react';
import ReactDOM from 'react-dom/client';
import './scss/main.scss';
import App from './App';
import ErrorBoundary from './components/error/ErrorBoundary';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
	// <React.StrictMode>
	<ErrorBoundary>
		<App />
	</ErrorBoundary>
	// </React.StrictMode>
);
