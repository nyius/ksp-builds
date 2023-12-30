import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import useFilters from '../../context/filters/FiltersActions';
import { useFiltersContext } from '../../context/filters/FiltersContext';
//---------------------------------------------------------------------------------------------------//
import { GiGalaxy, GiMarsCuriosity, GiRocketFlight } from 'react-icons/gi';
import { BiPlanet } from 'react-icons/bi';
import { IoIosRocket } from 'react-icons/io';
import { ImAirplane } from 'react-icons/im';
import { FaSatellite } from 'react-icons/fa';
import { VscSymbolMisc } from 'react-icons/vsc';
//---------------------------------------------------------------------------------------------------//
import SpaceStation from '../../assets/spaceStaion.svg';
import LunarModule from '../../assets/lunarModule.svg';
import Probe from '../../assets/probe.svg';
import Shuttle from '../../assets/space-shuttle-svgrepo-com.svg';
import Replica from '../../assets/replica-icon.svg';
//---------------------------------------------------------------------------------------------------//
import useCheckUrlForType from '../../hooks/useCheckUrlForType';

/**
 * Returns the icon associated with each link
 * @param {string} icon
 * @returns
 */
const getLinkIcon = icon => {
	if (icon === 'Interplanetary') {
		return (
			<span id={icon} className="text-xl 2k:text-3xl text-white z-50">
				<BiPlanet />
			</span>
		);
	} else if (icon === 'Interstellar') {
		return (
			<span id={icon} className="text-xl 2k:text-3xl text-white z-50">
				<GiGalaxy />
			</span>
		);
	} else if (icon === 'Satellite') {
		return (
			<span id={icon} className="text-xl 2k:text-3xl text-white z-50">
				<FaSatellite />
			</span>
		);
	} else if (icon === 'Space Station') {
		return (
			<span id={icon} className="text-xl 2k:text-3xl text-white z-50">
				<img src={SpaceStation} className="h-6 2k:h-10" alt="" />
			</span>
		);
	} else if (icon === 'Lander') {
		return (
			<span id={icon} className="text-xl 2k:text-3xl text-white z-50">
				<img src={LunarModule} className="h-6 2k:h-10" alt="" />
			</span>
		);
	} else if (icon === 'Rover') {
		return (
			<span id={icon} className="text-xl 2k:text-3xl text-white z-50">
				<GiMarsCuriosity />
			</span>
		);
	} else if (icon === 'SSTO') {
		return (
			<span id={icon} className="text-xl 2k:text-3xl text-white z-50">
				<GiRocketFlight />
			</span>
		);
	} else if (icon === 'Spaceplane') {
		return (
			<span id={icon} className="text-xl 2k:text-3xl text-white z-50">
				<ImAirplane />
			</span>
		);
	} else if (icon === 'Probe') {
		return (
			<span id={icon} className="text-xl 2k:text-3xl text-white z-50">
				<img src={Probe} className="h-6 2k:h-10" alt="" />
			</span>
		);
	} else if (icon === 'Miscellaneous') {
		return (
			<span id={icon} className="text-xl 2k:text-3xl text-white z-50">
				<VscSymbolMisc />
			</span>
		);
	} else if (icon === 'Rocket') {
		return (
			<span id={icon} className="text-xl 2k:text-3xl text-white z-50">
				<IoIosRocket />
			</span>
		);
	} else if (icon === 'Historic') {
		return (
			<span id={icon} className="text-xl 2k:text-3xl text-white z-50">
				<img src={Shuttle} className="h-6 2k:h-10" alt="" />
			</span>
		);
	} else if (icon === 'Replica') {
		return (
			<span id={icon} className="text-xl 2k:text-3xl text-white z-50">
				<img src={Replica} className="h-6 2k:h-10" alt="" />
			</span>
		);
	}
};

/**
 * Displays a craft 'type' link on the left bar
 * @param {string} text - the text to display on the link
 * @returns
 */
function VerticalTypeLink({ text }) {
	const [type, setType] = useState('');
	const { typeFilter } = useFiltersContext();
	const { checkUrlForType } = useCheckUrlForType();
	const urlType = checkUrlForType();
	const { setTypeFilter } = useFilters();

	//---------------------------------------------------------------------------------------------------//
	return (
		<Link
			to={type === urlType ? '/' : `/builds/${text}`}
			className="flex flex-row w-full"
			onClick={e => {
				setTypeFilter(e.target.id);
				setType(e.target.id);
			}}
			id={text}
		>
			<div id={text} className="bg-primary w-12 2k:w-20 h-16 2k:h-26 flex items-center justify-center rounded-l-lg 2k:rounded-l-xl">
				{getLinkIcon(text)}
			</div>
			<div id={text} className="relative overflow-hidden h-16 2k:h-26 flex flex-row w-full bg-base-400">
				<div
					id={text}
					className={`relative rounded-none rounded-r-lg 2k:rounded-r-xl flex flex-row h-16 2k:h-32 hover:bg-violet-700 gap-12 lg:gap-6 2k:gap-16 variable-font-size font-light btn btn-block justify-start ${
						typeFilter === text ? 'bg-primary hover:bg-violet-900' : ''
					}text-slate-300`}
				>
					<p id={text} className="z-60 pixel-font">
						{text}
					</p>
				</div>
			</div>
		</Link>
	);
}

export default VerticalTypeLink;
