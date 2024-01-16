import React, { useEffect, useState } from 'react';
import TooltipPopup from '../../../components/tooltip/TooltipPopup';
import { usePopperTooltip } from 'react-popper-tooltip';
import { Editor, EditorState, convertFromRaw } from 'draft-js';
import { createDateFromFirebaseTimestamp } from '../../../utilities/createDateFromFirebaseTimestamp';
import { cloneDeep } from 'lodash';
import { useAccoladesContext } from '../../../context/accolades/AccoladesContext';

/**
 * Displays the full accolade
 * @param {object} accolade - the accolade object
 * @param {func} setSelectedAccolades - state to update if this accolade is selected
 * @param {arr} selectedAccolades - currently selected accoladed
 * @returns
 */
function RemoveAccoladeFullIcon({ accolade, selectedAccolades, setSelectedAccolades }) {
	const { getArrowProps, getTooltipProps, setTooltipRef, setTriggerRef, visible } = usePopperTooltip();
	const { fetchedAccolades } = useAccoladesContext();
	const [accoladeItem, setAccoladeItem] = useState(null);

	/**
	 * Handles selecting an accolade
	 * @param {*} e
	 */
	const handleSelectAccolade = e => {
		setSelectedAccolades(prevState => {
			const newState = cloneDeep(prevState);
			const foundAccolade = newState.filter(filterAccolade => filterAccolade.dateReceived.seconds + filterAccolade.dateReceived.nanoseconds === accolade.dateReceived.seconds + accolade.dateReceived.nanoseconds);
			if (foundAccolade.length > 0) {
				const index = newState.findIndex(accoladeIndex => accoladeIndex.dateReceived.seconds + accoladeIndex.dateReceived.nanoseconds === accolade.dateReceived.seconds + accolade.dateReceived.nanoseconds);
				newState.splice(index, 1);
				return newState;
			} else {
				return [...prevState, accolade];
			}
		});
	};

	/**
	 * Handles checking if the current accolade is selected
	 * @returns
	 */
	const checkIfAccoladeSelected = () => {
		const foundAccolade = selectedAccolades.filter(filterAccolade => filterAccolade.dateReceived.seconds + filterAccolade.dateReceived.nanoseconds === accolade.dateReceived.seconds + accolade.dateReceived.nanoseconds);
		if (foundAccolade.length > 0) {
			return true;
		} else {
			return false;
		}
	};

	useEffect(() => {
		const matchingAccolade = fetchedAccolades.filter(filterAccolade => filterAccolade.id === accolade.id);
		setAccoladeItem(matchingAccolade[0]);
	}, []);

	if (!accoladeItem) return;

	return (
		<div
			className={`flex flex-col w-full gap-3 2k:gap-5 max-w-sm 2k:max-w-md rounded-xl p-4 items-center cursor-pointer ${
				checkIfAccoladeSelected() ? 'border-slate-400 hover:border-slate-300 bg-base-500' : 'border-transparent hover:border-slate-400 bg-base-200'
			}  border-2 border-dashed`}
			onClick={handleSelectAccolade}
		>
			<div className="text-2xl 2k:text-3xl text-slate-200 font-bold">{accoladeItem?.name}</div>
			{accoladeItem?.iconLg ? (
				<>
					<img ref={setTriggerRef} src={accoladeItem?.iconLg} className="w-44 h-44 object-scale-down cursor-pointer" />
					<TooltipPopup text={accoladeItem?.tooltip ? accoladeItem?.tooltip : accoladeItem?.name} getArrowProps={getArrowProps} visible={visible} getTooltipProps={getTooltipProps} setTooltipRef={setTooltipRef} />
				</>
			) : null}

			<div className="text-xl 2k:text-2xl text-slate-500 italic self-start">{accolade.dateReceived?.seconds && createDateFromFirebaseTimestamp(accolade.dateReceived.seconds)}</div>
			<div className="text-xl 2k:text-2xl text-slate-500 italic self-start">
				+<span className="font-bold">{accoladeItem.points}</span> points
			</div>
			<>{accoladeItem.description && typeof accoladeItem.description !== 'object' ? <Editor editorState={EditorState.createWithContent(convertFromRaw(JSON.parse(accoladeItem.description)))} readOnly={true} toolbarHidden={true} /> : ''}</>
		</div>
	);
}

export default RemoveAccoladeFullIcon;
