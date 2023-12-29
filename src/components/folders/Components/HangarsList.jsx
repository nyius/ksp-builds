import React from 'react';
import { useHangarContext } from '../../../context/hangars/HangarContext';
import UsersHangars from './UsersHangars';
import PersonalHangars from './PersonalHangars';

/**
 * Displays all of a users hangars
 * @returns
 */
function HangarsList() {
	const { collapsedHangars, hangarView } = useHangarContext();

	//---------------------------------------------------------------------------------------------------//
	if (!collapsedHangars) {
		return (
			<div className={`flex ${hangarView === 'grid' ? 'flex-row' : ''} ${hangarView === 'list' ? 'flex-col' : ''} flex-wrap gap-2 w-full`}>
				<UsersHangars />
				<PersonalHangars />
			</div>
		);
	}
}

export default HangarsList;
