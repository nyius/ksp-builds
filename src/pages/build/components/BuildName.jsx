import React, { useContext } from 'react';
import BuildContext from '../../../context/build/BuildContext';

/**
 * Displays the builds name
 * @returns
 */
function BuildName() {
	const { loadedBuild } = useContext(BuildContext);

	return <h1 className="text-slate-200 text-3xl font-bold 2k:text-4xl pixel-font">{loadedBuild.name}</h1>;
}

export default BuildName;
