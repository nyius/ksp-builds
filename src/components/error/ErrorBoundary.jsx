import React, { useState, useEffect } from 'react';
import MiddleContainer from '../containers/middleContainer/MiddleContainer';
import PlanetHeader from '../header/PlanetHeader';
import Button from '../buttons/Button';
import PlanetExplosion from '../../assets/planet_explosion.png';

/**
 * Displays an error page if the site crashes
 * @param {*} param0
 * @returns
 */
const ErrorBoundary = ({ children }) => {
	const [hasError, setHasError] = useState(false);
	const [errorMsg, setErrorMsg] = useState('');

	useEffect(() => {
		const handleErrors = (error, errorInfo) => {
			setHasError(true);
			setErrorMsg({ error, errorInfo });
			// You can log the error to an error reporting service
			console.log(`1 - ERROR: -----------------------------------------------------------------------------`);
			console.error(error);
			console.log(`2 - ERROR INFO -----------------------------------------------------------------------------`);
			console.error(errorInfo);
		};

		window.addEventListener('error', handleErrors);

		// Cleanup the event listener when the component unmounts
		return () => {
			window.removeEventListener('error', handleErrors);
		};
	}, []);

	if (hasError) {
		return (
			<MiddleContainer css="items-center justify-center">
				<div className="flex flex-col gap-4">
					<PlanetHeader text="Whoops... Looks like we experienced a R.U.D" css="!h-32" />
					<div className="text-xl 2k:text-2xl text-white">Something went wrong. Please try again later.</div>
					<div className="text-lg 2k:text-xl text-white">If you keep seeing this screen, please let us know and we can try to help!</div>
					<div className="text-lg 2k:text-xl text-white">You can reach out through discord, messaging u/nyius on the website, our using our contact page.</div>
					<div className="divider"></div>
					<div className="text-lg 2k:text-xl font-bold">Error:</div>

					<div className="text-lg 2k:text-xl text-white">{errorMsg.error.message}</div>

					<div className="divider"></div>

					<Button text="Reload" icon="home" color="btn-primary" onClick={() => window.location.reload()} />
					<img className="w-1/2" src={PlanetExplosion} alt="Crashed Spaceship" />
				</div>
			</MiddleContainer>
		);
	}

	return children;
};

export default ErrorBoundary;
