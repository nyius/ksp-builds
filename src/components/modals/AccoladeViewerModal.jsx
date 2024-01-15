import React from 'react';
import Button from '../buttons/Button';
import PlanetHeader from '../header/PlanetHeader';
import AccoladeFull from '../accolades/AccoladeFull';
import { useAccoladesContext } from '../../context/accolades/AccoladesContext';
import { setAccoladeViewer } from '../../context/accolades/AccoladesActions';

/**
 * Modal for vieweing an accolade
 * @returns
 */
function AccoladeViewerModal() {
	const { accoladeViewer, dispatchAccolades } = useAccoladesContext();

	const closeAccoladeViewer = () => {
		setAccoladeViewer(dispatchAccolades, null);
	};

	if (accoladeViewer) {
		//---------------------------------------------------------------------------------------------------//
		return (
			<>
				<input type="checkbox" defaultChecked="true" className="modal-toggle" />
				<div className="modal">
					<div className="modal-box relative">
						<Button style="btn-circle" position="absolute right-2 top-2 z-50" text="X" onClick={closeAccoladeViewer} />
						<PlanetHeader text={accoladeViewer.name} />
						<AccoladeFull accolade={accoladeViewer} />
					</div>
				</div>
			</>
		);
	}
}

export default AccoladeViewerModal;
