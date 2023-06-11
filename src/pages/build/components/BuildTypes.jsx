import React, { useContext } from 'react';
import BuildContext from '../../../context/build/BuildContext';
import TypeBadge from '../../../components/typeBadge/TypeBadge';

/**
 * Displays a builds tags
 * @returns
 */
function BuildTypes() {
	const { loadedBuild } = useContext(BuildContext);

	return (
		<div className="flex flex-row flex-wrap gap-2">
			{loadedBuild.type.map(type => {
				return <TypeBadge key={type} type={type} />;
			})}
		</div>
	);
}

export default BuildTypes;
