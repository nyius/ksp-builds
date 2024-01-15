import React from 'react';
import TooltipPopup from '../tooltip/TooltipPopup';
import { usePopperTooltip } from 'react-popper-tooltip';
import { Editor, EditorState, convertFromRaw } from 'draft-js';
import { createDateFromFirebaseTimestamp } from '../../utilities/createDateFromFirebaseTimestamp';

/**
 * Displays the full accolade
 * @param {object} accolade - the accolade object
 * @param {*} description - (optional) the draftjs description to pass in, if not included in the accolade
 * @param {bool} remove - (optional) if there should be a 'remove accolade' button to remove it from a user
 * @returns
 */
function AccoladeFull({ accolade, description, remove }) {
	const { getArrowProps, getTooltipProps, setTooltipRef, setTriggerRef, visible } = usePopperTooltip();

	return (
		<div className="flex flex-col w-full gap-3 2k:gap-5 bg-base-200 rounded-xl p-4 justify-center items-center">
			<div className="text-2xl 2k:text-3xl text-slate-200 font-bold">{accolade?.name}</div>
			{accolade?.iconLg ? (
				<>
					<img ref={setTriggerRef} src={accolade?.iconLg} className="w-44 h-44 object-scale-down cursor-pointer" />
					<TooltipPopup text={accolade?.tooltip ? accolade?.tooltip : accolade?.name} getArrowProps={getArrowProps} visible={visible} getTooltipProps={getTooltipProps} setTooltipRef={setTooltipRef} />
				</>
			) : null}

			<div className="flex flex-row w-full place-content-between items-center">
				<div className="text-xl 2k:text-2xl text-slate-500 italic self-start">{accolade.dateReceived?.seconds && createDateFromFirebaseTimestamp(accolade.dateReceived.seconds)}</div>
				<div className="text-xl 2k:text-2xl text-slate-400">
					+ <span className="font-bold">{accolade.points}</span> points
				</div>
			</div>
			{description ? (
				<>{description && typeof description !== 'object' ? <Editor editorState={EditorState.createWithContent(convertFromRaw(JSON.parse(description)))} readOnly={true} toolbarHidden={true} /> : ''}</>
			) : (
				<>{accolade.description && typeof accolade.description !== 'object' ? <Editor editorState={EditorState.createWithContent(convertFromRaw(JSON.parse(accolade.description)))} readOnly={true} toolbarHidden={true} /> : ''}</>
			)}
		</div>
	);
}

export default AccoladeFull;
