import React from 'react';
import TypeBtn from './Buttons/TypeBtn';

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
				return [...prevState.filter(type => type !== newType)];
			});
		} else if (typesArr.length < 3) {
			setBuildState(prevState => {
				return [...prevState, newType];
			});
		}
	};

	//---------------------------------------------------------------------------------------------------//
	return (
		<div className="btn-group mb-6 2k:mb-10">
			<TypeBtn name="Rocket" setTypes={setTypes} typesArr={typesArr} />
			<TypeBtn name="Interplanetary" setTypes={setTypes} typesArr={typesArr} />
			<TypeBtn name="Interstellar" setTypes={setTypes} typesArr={typesArr} />
			<TypeBtn name="Satellite" setTypes={setTypes} typesArr={typesArr} />
			<TypeBtn name="Space Station" setTypes={setTypes} typesArr={typesArr} />
			<TypeBtn name="Lander" setTypes={setTypes} typesArr={typesArr} />
			<TypeBtn name="Rover" setTypes={setTypes} typesArr={typesArr} />
			<TypeBtn name="SSTO" setTypes={setTypes} typesArr={typesArr} />
			<TypeBtn name="Spaceplane" setTypes={setTypes} typesArr={typesArr} />
			<TypeBtn name="Historic" setTypes={setTypes} typesArr={typesArr} />
			<TypeBtn name="Replica" setTypes={setTypes} typesArr={typesArr} />
			<TypeBtn name="Probe" setTypes={setTypes} typesArr={typesArr} />
			<TypeBtn name="Miscellaneous" setTypes={setTypes} typesArr={typesArr} />
		</div>
	);
}

export default BuildTypes;
