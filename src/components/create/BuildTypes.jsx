import React from 'react';

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
			setBuildState(prevState => {
				return { ...prevState, type: prevState.type.filter(type => type !== newType) };
			});
		} else if (typesArr.length < 3) {
			setBuildState(prevState => {
				return { ...prevState, type: [...prevState.type, newType] };
			});
		}
	};

	return (
		<div className="btn-group mb-6 2k:mb-10">
			<button onClick={e => setTypes(`Interplanetary`)} className={`btn 2k:btn-lg 2k:text-2xl 2k:font-thin ${typesArr.includes('Interplanetary') && 'btn-active'}`}>
				Interplanetary
			</button>
			<button onClick={e => setTypes(`Interstellar`)} className={`btn 2k:btn-lg 2k:text-2xl 2k:font-thin ${typesArr.includes('Interstellar') && 'btn-active'}`}>
				Interstellar
			</button>
			<button onClick={e => setTypes(`Satellite`)} className={`btn 2k:btn-lg 2k:text-2xl 2k:font-thin ${typesArr.includes('Satellite') && 'btn-active'}`}>
				Satellite
			</button>
			<button onClick={e => setTypes(`Space Station`)} className={`btn 2k:btn-lg 2k:text-2xl 2k:font-thin ${typesArr.includes('Space Station') && 'btn-active'}`}>
				Space Station
			</button>
			<button onClick={e => setTypes(`Lander`)} className={`btn 2k:btn-lg 2k:text-2xl 2k:font-thin ${typesArr.includes('Lander') && 'btn-active'}`}>
				Lander
			</button>
			<button onClick={e => setTypes(`Rover`)} className={`btn 2k:btn-lg 2k:text-2xl 2k:font-thin ${typesArr.includes('Rover') && 'btn-active'}`}>
				Rover
			</button>
			<button onClick={e => setTypes(`SSTO`)} className={`btn 2k:btn-lg 2k:text-2xl 2k:font-thin ${typesArr.includes('SSTO') && 'btn-active'}`}>
				SSTO
			</button>
			<button onClick={e => setTypes(`Spaceplane`)} className={`btn 2k:btn-lg 2k:text-2xl 2k:font-thin ${typesArr.includes('Spaceplane') && 'btn-active'}`}>
				Spaceplane
			</button>
			<button onClick={e => setTypes(`Probe`)} className={`btn 2k:btn-lg 2k:text-2xl 2k:font-thin ${typesArr.includes('Probe') && 'btn-active'}`}>
				Probe
			</button>
		</div>
	);
}

export default BuildTypes;
