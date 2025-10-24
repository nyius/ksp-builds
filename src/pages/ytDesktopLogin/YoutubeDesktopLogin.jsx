import React from 'react';
import useResetStates from '../../hooks/useResetStates';
import MiddleContainer from '../../components/containers/middleContainer/MiddleContainer';
import PlanetHeader from '../../components/header/PlanetHeader';
import AstroBiff from '../../assets/astrobiff-balloon.png';
import Helmet from '../../components/Helmet/Helmet';

/**
 * Privacy Policy Page
 * @returns
 */
function YoutubeDesktopLogin() {
	useResetStates();

	const [code, setCode] = useState(null);
	const [error, setError] = useState(null);

	useEffect(() => {
		// Extract authorization code from URL
		const urlParams = new URLSearchParams(window.location.search);
		const authCode = urlParams.get('code');
		const authError = urlParams.get('error');

		if (authError) {
			setError(authError);
		} else if (authCode) {
			setCode(authCode);

			// Attempt to redirect to the app after 2 seconds
			setTimeout(() => {
				window.location.href = `ytmusic-desktop://oauth/callback?code=${authCode}`;
			}, 2000);
		}
	}, []);

	//---------------------------------------------------------------------------------------------------//
	return (
		<>
			<MiddleContainer>
				<PlanetHeader text="Youtube Desktop Login" />

				<div className="flex justify-center items-center h-screen m-0 bg-gray-100">
					<div className="text-center bg-white p-8 rounded-lg shadow-lg">
						<div className={`text-xl mb-4 ${error ? 'text-red-500' : 'text-green-500'}`}>{error ? '❌ OAuth Error' : '✅ OAuth Authorization Successful!'}</div>

						<div className="text-gray-600 mb-4">{error ? `Error: ${error}` : 'Redirecting to YouTube Music Desktop...'}</div>

						{!error && <div className="text-gray-600 mb-4">If the app doesn't open automatically, you can close this window.</div>}

						{code && <div className="bg-gray-100 p-2 rounded font-mono text-sm break-all">Code: {code}</div>}
					</div>
				</div>
			</MiddleContainer>
		</>
	);
}

export default YoutubeDesktopLogin;
