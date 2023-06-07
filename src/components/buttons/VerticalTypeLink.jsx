import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import useFilters from '../../context/filters/FiltersActions';
import FiltersContext from '../../context/filters/FiltersContext';
//---------------------------------------------------------------------------------------------------//
import { BiPlanet } from 'react-icons/bi';
import { IoIosRocket } from 'react-icons/io';
import { ImAirplane } from 'react-icons/im';
import { FaSatellite } from 'react-icons/fa';
import { GiGalaxy, GiMarsCuriosity, GiRocketFlight } from 'react-icons/gi';
import { VscSymbolMisc } from 'react-icons/vsc';
//---------------------------------------------------------------------------------------------------//
import SpaceStation from '../../assets/spaceStaion.svg';
import LunarModule from '../../assets/lunarModule.svg';
import Probe from '../../assets/probe.svg';
import Shuttle from '../../assets/space-shuttle-svgrepo-com.svg';
import Replica from '../../assets/replica-icon.svg';
import useCheckUrlForType from '../../utilities/useCheckUrlForType';

function VerticalTypeLink({ text }) {
	const [type, setType] = useState('');
	const { typeFilter } = useContext(FiltersContext);

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
			<div id={text} className="bg-primary w-12 2k:w-20 h-20 2k:h-26 flex items-center justify-center rounded-l-lg 2k:rounded-l-xl">
				{text === 'Interplanetary' && (
					<span id={text} className="text-xl 2k:text-3xl text-white z-50">
						<BiPlanet />
					</span>
				)}
				{text === 'Interstellar' && (
					<span id={text} className="text-xl 2k:text-3xl text-white z-50">
						<GiGalaxy />
					</span>
				)}
				{text === 'Satellite' && (
					<span id={text} className="text-xl 2k:text-3xl text-white z-50">
						<FaSatellite />
					</span>
				)}
				{text === 'Space Station' && (
					<span id={text} className="text-xl 2k:text-3xl text-white z-50">
						<img src={SpaceStation} className="h-6 2k:h-10" alt="" />
					</span>
				)}
				{text === 'Lander' && (
					<span id={text} className="text-xl 2k:text-3xl text-white z-50">
						<img src={LunarModule} className="h-6 2k:h-10" alt="" />
					</span>
				)}
				{text === 'Rover' && (
					<span id={text} className="text-xl 2k:text-3xl text-white z-50">
						<GiMarsCuriosity />
					</span>
				)}
				{text === 'SSTO' && (
					<span id={text} className="text-xl 2k:text-3xl text-white z-50">
						<GiRocketFlight />
					</span>
				)}
				{text === 'Spaceplane' && (
					<span id={text} className="text-xl 2k:text-3xl text-white z-50">
						<ImAirplane />
					</span>
				)}
				{text === 'Probe' && (
					<span id={text} className="text-xl 2k:text-3xl text-white z-50">
						<img src={Probe} className="h-6 2k:h-10" alt="" />
					</span>
				)}
				{text === 'Miscellaneous' && (
					<span id={text} className="text-xl 2k:text-3xl text-white z-50">
						<VscSymbolMisc />
					</span>
				)}
				{text === 'Rocket' && (
					<span id={text} className="text-xl 2k:text-3xl text-white z-50">
						<IoIosRocket />
					</span>
				)}
				{text === 'Historic' && (
					<span id={text} className="text-xl 2k:text-3xl text-white z-50">
						<img src={Shuttle} className="h-6 2k:h-10" alt="" />
					</span>
				)}
				{text === 'Replica' && (
					<span id={text} className="text-xl 2k:text-3xl text-white z-50">
						<img src={Replica} className="h-6 2k:h-10" alt="" />
					</span>
				)}
			</div>
			<div id={text} className="relative overflow-hidden h-20 2k:h-26 flex flex-row w-full bg-base-400">
				<div
					id={text}
					className={`relative rounded-none rounded-r-lg 2k:rounded-r-xl flex flex-row h-20 2k:h-32 hover:bg-violet-700 gap-12 lg:gap-6 2k:gap-16 variable-font-size font-light btn btn-block justify-start 2k:h-20 ${
						typeFilter === text ? 'bg-primary hover:bg-violet-900' : ' '
					} text-slate-300`}
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
