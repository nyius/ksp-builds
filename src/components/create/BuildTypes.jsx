import React from 'react';
import Button from '../buttons/Button';

/**
 * Takes in a "typesArr" which is an array of types for the build (so we can check if we have that type already selected or not).
 * Takes in a setBuildState state manager to set the type when selected
 * @param {*} typesArr
 * @param {*} setBuildState
 * @returns
 */
function BuildTypes({ typesArr, setBuildState }) {
	/**
	 * Handles setting the build type
	 * @param {*} newType
	 */
	const setTypes = newType => {
		if (typesArr.includes(newType)) {
			console.log(typesArr, newType);
			setBuildState(prevState => {
				return { ...prevState, type: prevState.type.filter(type => type !== newType) };
			});
		} else if (typesArr.length < 3) {
			setBuildState(prevState => {
				return { ...prevState, type: [...prevState.type, newType] };
			});
		}
	};

	//---------------------------------------------------------------------------------------------------//
	return (
		<div className="btn-group mb-6 2k:mb-10">
			<Button type="button" color="text-slate-300" text="Rocket" onClick={e => setTypes(`Rocket`)} css={`btn 2k:btn-lg 2k:text-2xl 2k:font-thin ${typesArr.includes('Rocket') && 'btn-active bg-primary'}`} />
			<Button type="button" color="text-slate-300" text="Interplanetary" onClick={e => setTypes(`Interplanetary`)} css={`btn 2k:btn-lg 2k:text-2xl 2k:font-thin ${typesArr.includes('Interplanetary') && 'btn-active bg-primary'}`} />
			<Button type="button" color="text-slate-300" text="Interstellar" onClick={e => setTypes(`Interstellar`)} css={`btn 2k:btn-lg 2k:text-2xl 2k:font-thin ${typesArr.includes('Interstellar') && 'btn-active bg-primary'}`} />
			<Button type="button" color="text-slate-300" text="Satellite" onClick={e => setTypes(`Satellite`)} css={`btn 2k:btn-lg 2k:text-2xl 2k:font-thin ${typesArr.includes('Satellite') && 'btn-active bg-primary'}`} />
			<Button type="button" color="text-slate-300" text="Space Station" onClick={e => setTypes(`Space Station`)} css={`btn 2k:btn-lg 2k:text-2xl 2k:font-thin ${typesArr.includes('Space Station') && 'btn-active bg-primary'}`} />
			<Button type="button" color="text-slate-300" text="Lander" onClick={e => setTypes(`Lander`)} css={`btn 2k:btn-lg 2k:text-2xl 2k:font-thin ${typesArr.includes('Lander') && 'btn-active bg-primary'}`} />
			<Button type="button" color="text-slate-300" text="Rover" onClick={e => setTypes(`Rover`)} css={`btn 2k:btn-lg 2k:text-2xl 2k:font-thin ${typesArr.includes('Rover') && 'btn-active bg-primary'}`} />
			<Button type="button" color="text-slate-300" text="SSTO" onClick={e => setTypes(`SSTO`)} css={`btn 2k:btn-lg 2k:text-2xl 2k:font-thin ${typesArr.includes('SSTO') && 'btn-active bg-primary'}`} />
			<Button type="button" color="text-slate-300" text="Spaceplane" onClick={e => setTypes(`Spaceplane`)} css={`btn 2k:btn-lg 2k:text-2xl 2k:font-thin ${typesArr.includes('Spaceplane') && 'btn-active bg-primary'}`} />
			<Button type="button" color="text-slate-300" text="Historic" onClick={e => setTypes(`Historic`)} css={`btn 2k:btn-lg 2k:text-2xl 2k:font-thin ${typesArr.includes('Historic') && 'btn-active bg-primary'}`} />
			<Button type="button" color="text-slate-300" text="Replica" onClick={e => setTypes(`Replica`)} css={`btn 2k:btn-lg 2k:text-2xl 2k:font-thin ${typesArr.includes('Replica') && 'btn-active bg-primary'}`} />
			<Button type="button" color="text-slate-300" text="Probe" onClick={e => setTypes(`Probe`)} css={`btn 2k:btn-lg 2k:text-2xl 2k:font-thin ${typesArr.includes('Probe') && 'btn-active bg-primary'}`} />
			<Button type="button" color="text-slate-300" text="Miscellaneous" onClick={e => setTypes(`Miscellaneous`)} css={`btn 2k:btn-lg 2k:text-2xl 2k:font-thin ${typesArr.includes('Miscellaneous') && 'btn-active bg-primary'}`} />
		</div>
	);
}

export default BuildTypes;
