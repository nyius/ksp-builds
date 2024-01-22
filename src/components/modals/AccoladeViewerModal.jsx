import React, { useEffect, useState } from 'react';
import Button from '../buttons/Button';
import PlanetHeader from '../header/PlanetHeader';
import AccoladeFull from '../accolades/AccoladeFull';
import { useAccoladesContext } from '../../context/accolades/AccoladesContext';
import { setAccoladeViewer } from '../../context/accolades/AccoladesActions';
import { createDateFromFirebaseTimestamp } from '../../utilities/createDateFromFirebaseTimestamp';

/**
 * Modal for vieweing an accolade
 * @returns
 */
function AccoladeViewerModal() {
	const { accoladeViewer, accoladeViewerUserAccolades, dispatchAccolades } = useAccoladesContext();

	const closeAccoladeViewer = () => {
		setAccoladeViewer(dispatchAccolades, null, null);
	};

	if (accoladeViewer) {
		//---------------------------------------------------------------------------------------------------//
		return (
			<>
				<input type="checkbox" defaultChecked="true" className="modal-toggle" />
				<div className="modal">
					<div className="modal-box relative">
						<Button style="btn-circle" position="absolute right-2 top-2 z-50" text="X" onClick={closeAccoladeViewer} />
						<PlanetHeader text={accoladeViewer.name} css="h-fit" />
						<AccoladeFull accolade={accoladeViewer} />

						<div className="text-xl 2k:text-2xl text-slate-300 mt-5 mb-2 2k:mt-8">
							Awarded <span className="font-bold text-success">{accoladeViewerUserAccolades?.length}</span> {accoladeViewerUserAccolades?.length === 1 ? 'time' : 'times'}
						</div>
						{accoladeViewerUserAccolades?.map(userAccolade => {
							return <div className="text-xl 2k:text-2xl text-success py-3 2k:py-4 px-5 2k:px-7 rounded-lg bg-base-300 my-2">{createDateFromFirebaseTimestamp(userAccolade.dateReceived.seconds)}</div>;
						})}
					</div>
				</div>
			</>
		);
	}
}

export default AccoladeViewerModal;
