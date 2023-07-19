import React from 'react';
import { useBuildContext } from '../../../context/build/BuildContext';
import TypeBadge from '../../../components/typeBadge/TypeBadge';

/**
 * Displays a builds tags
 * @returns
 */
function BuildTypes() {
	const { loadedBuild } = useBuildContext();

	return (
		<div className="flex flex-row flex-wrap gap-2">
			{loadedBuild.types.map(type => {
				return <TypeBadge key={type} type={type} />;
			})}
		</div>
	);
}

export default BuildTypes;
