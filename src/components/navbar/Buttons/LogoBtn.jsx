import React from 'react';
import { Link } from 'react-router-dom';
import useFilters from '../../../context/filters/FiltersActions';
import { useChangePage } from '../../../context/builds/BuildsActions';
import Logo from '../../../assets/logo_light_full.png';

/**
 * Displays the logo button
 * @returns
 */
function LogoBtn() {
	const { resetFilters } = useFilters();
	const { goToStartPage } = useChangePage();

	return (
		<Link
			onClick={() => {
				resetFilters();
				goToStartPage(0);
			}}
			to="/"
		>
			<img src={Logo} className="h-10 2k:h-20 btn btn-ghost hidden sm:block" alt="KSP Builds Logo, navigate home" />
		</Link>
	);
}

export default LogoBtn;
