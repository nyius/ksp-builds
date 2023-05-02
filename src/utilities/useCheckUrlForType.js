import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

function useCheckUrlForType() {
	const location = useLocation();

	const checkUrlForType = () => {
		const parseUrl = url => {
			return url.replace('%20', ' ');
		};

		const currentPath = parseUrl(location.pathname);
		if (currentPath !== '/') {
			let type;
			if (currentPath === '/builds/Rocket') {
				type = 'Rocket';
			}
			if (currentPath === '/builds/Interplanetary') {
				type = 'Interplanetary';
			}
			if (currentPath === '/builds/Interstellar') {
				type = 'Interstellar';
			}
			if (currentPath === '/builds/Satellite') {
				type = 'Satellite';
			}
			if (currentPath === '/builds/Space Station') {
				type = 'Space Station';
			}
			if (currentPath === '/builds/Lander') {
				type = 'Lander';
			}
			if (currentPath === '/builds/Rover') {
				type = 'Rover';
			}
			if (currentPath === '/builds/SSTO') {
				type = 'SSTO';
			}
			if (currentPath === '/builds/Spaceplane') {
				type = 'Spaceplane';
			}
			if (currentPath === '/builds/Probe') {
				type = 'Probe';
			}
			if (currentPath === '/builds/Historic') {
				type = 'Historic';
			}
			if (currentPath === '/builds/Replica') {
				type = 'Replica';
			}
			if (currentPath === '/builds/Miscellaneous') {
				type = 'Miscellaneous';
			}

			return type;
		}
	};

	return { checkUrlForType };
}

export default useCheckUrlForType;
