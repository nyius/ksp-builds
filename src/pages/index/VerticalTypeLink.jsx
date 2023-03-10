import React, { useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import useFilters from '../../context/filters/FiltersActions';
import FiltersContext from '../../context/filters/FiltersContext';
//---------------------------------------------------------------------------------------------------//
import { BiPlanet } from 'react-icons/bi';
import { IoIosRocket } from 'react-icons/io';
import { ImAirplane } from 'react-icons/im';
import { FaSatellite } from 'react-icons/fa';
import { GiGalaxy, GiMarsCuriosity } from 'react-icons/gi';
//---------------------------------------------------------------------------------------------------//
import SpaceStation from '../../assets/spaceStaion.svg';
import LunarModule from '../../assets/lunarModule.svg';
import Shuttle from '../../assets/Shuttle.png';
import Satellite from '../../assets/Satellite.png';
import Rocket1 from '../../assets/Rocket1.png';
import Probe from '../../assets/probe.svg';

function VerticalTypeLink({ text }) {
	const navigate = useNavigate();
	const { typeFilter } = useContext(FiltersContext);

	const { setTypeFilter } = useFilters();
	return (
		<Link
			to={`/builds/${text}`}
			id={text}
			onClick={e => {
				setTypeFilter(e.target.id);
			}}
			className="relative overflow-hidden h-20 2k:h-32"
		>
			<div id={text} className={`flex flex-row h-20 2k:h-32 gap-12 lg:gap-6 2k:gap-16 variable-font-size font-light btn btn-block justify-start 2k:h-20 ${typeFilter === text ? 'bg-primary hover:bg-violet-900' : 'bg-base-400'} text-slate-300`}>
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
				<p className="z-60 font-bold">{text}</p>
			</div>
		</Link>
	);
}

export default VerticalTypeLink;
