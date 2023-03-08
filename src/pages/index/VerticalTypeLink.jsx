import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import useFilters from '../../context/filters/FiltersActions';
import FiltersContext from '../../context/filters/FiltersContext';
//---------------------------------------------------------------------------------------------------//
import { BiPlanet } from 'react-icons/bi';
import { IoIosRocket } from 'react-icons/io';
import { ImAirplane } from 'react-icons/im';
import { GiGalaxy, GiMarsCuriosity } from 'react-icons/gi';
import { FaSatellite } from 'react-icons/fa';
import SpaceStation from '../../assets/spaceStaion.svg';
import LunarModule from '../../assets/lunarModule.svg';
import Probe from '../../assets/probe.svg';

function VerticalTypeLink({ text }) {
	const navigate = useNavigate();
	const { typeFilter } = useContext(FiltersContext);

	const { setTypeFilter } = useFilters();
	return (
		<li
			id={text}
			onClick={e => {
				setTypeFilter(e);
				navigate(`builds/${e.target.id}`);
			}}
			className=""
		>
			<a id={text} className={`flex flex-row gap-12 2k:gap-16 text-2xl md:text-lg 2k:text-2xl font-light btn btn-block justify-start 2k:h-20 ${typeFilter === text && 'bg-primary hover:bg-violet-900'} text-slate-300`}>
				{text === 'Interplanetary' && (
					<span className="text-xl 2k:text-3xl">
						<BiPlanet />
					</span>
				)}
				{text === 'Interstellar' && (
					<span className="text-xl 2k:text-3xl">
						<GiGalaxy />
					</span>
				)}
				{text === 'Satellite' && (
					<span className="text-xl 2k:text-3xl">
						<FaSatellite />
					</span>
				)}
				{text === 'Space Station' && (
					<span className="text-xl 2k:text-3xl">
						<img src={SpaceStation} className="h-6 2k:h-10" alt="" />
					</span>
				)}
				{text === 'Lander' && (
					<span className="text-xl 2k:text-3xl">
						<img src={LunarModule} className="h-6 2k:h-10" alt="" />
					</span>
				)}
				{text === 'Rover' && (
					<span className="text-xl 2k:text-3xl">
						<GiMarsCuriosity />
					</span>
				)}
				{text === 'SSTO' && (
					<span className="text-xl 2k:text-3xl">
						<IoIosRocket />
					</span>
				)}
				{text === 'Spaceplane' && (
					<span className="text-xl 2k:text-3xl">
						<ImAirplane />
					</span>
				)}
				{text === 'Probe' && (
					<span className="text-xl 2k:text-3xl">
						<img src={Probe} className="h-6 2k:h-10" alt="" />
					</span>
				)}
				{text}
			</a>
		</li>
	);
}

export default VerticalTypeLink;
