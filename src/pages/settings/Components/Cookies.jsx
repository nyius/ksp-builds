import React, { useContext } from 'react';
import ResetCookiesBtn from './Buttons/ResetCookiesBtn';

/**
 * Cookies Section
 * @returns
 */
function Cookies() {
	return (
		<>
			<div className="flex flex-col gap-2 2k:gap-4">
				<div className="text-xl 2k:text-3xl text-white font-bold">Cookies</div>
				<p className="text-xl 2k:text-2xl text-white">Reset your cookie consent choice.</p>
				<ResetCookiesBtn />
			</div>
		</>
	);
}

export default Cookies;
