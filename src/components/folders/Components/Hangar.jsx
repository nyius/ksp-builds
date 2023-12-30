import React, { useState } from 'react';
import { FaSave } from 'react-icons/fa';
import { MdOutlineCheckBoxOutlineBlank, MdCheckBox } from 'react-icons/md';
import { useHangarContext } from '../../../context/hangars/HangarContext';
import { setNewHangarName, setSelectedHangar, setLongClickStart, setEditingHangarName, setLastSelectedHangar, useHandleHangarInteraction, setPinnedHangar, useAddBuildToHangar } from '../../../context/hangars/HangarActions';
import { checkIfBuildInHangar, checkIfHangarSelected } from '../../../context/hangars/HangarUtils';
import { AiFillPushpin, AiOutlinePushpin } from 'react-icons/ai';
import { useBuildContext } from '../../../context/build/BuildContext';
import { useAuthContext } from '../../../context/auth/AuthContext';
import { setDragBuild } from '../../../context/build/BuildActions';
import { ReactComponent as HangarIcon } from '../../../assets/hangar.svg';
import { ReactComponent as HangarPlusIcon } from '../../../assets/hangar-plus.svg';
import { ReactComponent as HangarMinusIcon } from '../../../assets/hangar-minus.svg';
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Handles displaying a single hangar icon
 * @param {obj} hangar - the hangar to display
 * @param {bool} editable - if the hangar is editable
 * @param {string} type - what type of hangar to display (optional, "new" if displaying a new hangar)
 * @param {bool} sidebar - whether or not this hanger is displayed in the sidebar or not
 * @returns
 */
function Hangar({ hangar, editable, type, sidebar }) {
	const { dispatchHangars, editingHangar, newHangarName, buildToAddToHangar, hangarView, selectedHangars, hangarLocation, pinnedHangar, savingToHangar } = useHangarContext();
	const { handleHangarClick, handleHangarLongClick, handleHangarBlur, handleHangarKeyPress, handleNewHangarKeyPress, handleNewHangarBlur, checkIfHangarOpen } = useHandleHangarInteraction();
	const { addBuildToHangar } = useAddBuildToHangar();
	const { dispatchBuild } = useBuildContext();
	const [hoverHangar, setHoverHangar] = useState(false);
	const [buildAdded, setBuildAdded] = useState(false);

	// Allows an image to be dropped on (for rearranging images)
	const allowDrop = e => {
		e.preventDefault();

		if (sidebar) {
			if (e.target.id === 'hangar-your-builds' || e.target.closest('.hangar')?.id === 'hangar-your-builds') return;
			if (e.target.id.includes('hangar')) {
				const hangarId = e.target.id.replace('hangar-', '');
				if (hangarId !== hoverHangar) {
					setHoverHangar(hangarId);
				}
			} else {
				const hangarId = e.target.closest('.hangar').id.replace('hangar-', '');
				if (hangarId !== hoverHangar) {
					setHoverHangar(hangarId);
				}
			}
		}
	};

	/**
	 * Stop highlighting a image square when not dragging over it
	 * @param {*} e
	 */
	const dragExit = e => {
		setHoverHangar(false);
	};

	/**
	 * Handles dropping a image after dragging it
	 * @param {*} e
	 */
	const drop = async e => {
		e.preventDefault();

		if (sidebar) {
			if (e.target.id === 'hangar-your-builds' || e.target.closest('.hangar').id === 'hangar-your-builds') return;

			setBuildAdded(true);
			let droppedId = e.dataTransfer.getData('text');
			await addBuildToHangar(droppedId, hangar.id);

			setHoverHangar(null);
			setDragBuild(dispatchBuild, null);

			setTimeout(() => {
				setBuildAdded(false);
			}, 1500);
		}
	};

	if (type === 'new' && !hangar) {
		return (
			<div
				tabIndex={0}
				className={`text-6xl flex ${hangarView === 'grid' && `flex-col`} ${hangarView === 'list' && `flex-row gap-4 2k:gap-6 w-full h-fit`} items-center cursor-pointer relative h-32 w-72 p-1 hover:bg-base-200 rounded-xl`}
				onKeyDown={e => handleNewHangarKeyPress(e)}
				onBlur={e => {
					handleNewHangarBlur(e);
				}}
			>
				<HangarIcon className="w-16 h-16" fill="#a6adbb" />
				<input
					type="text"
					className={`input text-lg 2k:text-xl ${newHangarName?.length > 50 ? 'text-red' : 'text-white'} bg-base-500`}
					placeholder="Enter hangar name"
					autoFocus
					onChange={e => setNewHangarName(dispatchHangars, e.target.value)}
				/>
			</div>
		);
	}

	//---------------------------------------------------------------------------------------------------//
	return (
		<div
			key={hangar.id}
			id={`hangar-${hangar.id}-tooltip`}
			className={`tooltip rounded-xl box-border border-2 border-transparent
			${sidebar ? 'w-full' : ''}
			${hoverHangar === hangar.id ? 'border-dashed !border-slate-500 bg-base-300' : ''}
			`}
			data-tip={hangar.hangarName}
			onDrop={e => drop(e)}
			onDragOver={e => allowDrop(e)}
			onDragLeave={e => dragExit(e)}
		>
			<div
				id={`hangar-${hangar.id}`}
				tabIndex={0}
				className={`hangar text-5xl 2k:text-6xl flex place-content-between cursor-pointer relative p-1 rounded-xl
				${sidebar ? '!text-[5rem] 2k:!text-[6rem] flex-col w-full py-3 2k:py-5 px-5 2k:px-7 gap-2 2k:gap-5' : 'items-center'} 
				${hangarView === 'grid' && !sidebar ? `flex-col ${editingHangar && editingHangar.id === hangar.id ? 'h-25 2k:h-32 w-60 2k:w-72' : 'w-[14rem] 2k:w-[17rem] h-[10rem] 2k:h-[11rem]'}` : ''} 
				${hangarView === 'list' && !sidebar ? `flex-row place-content-between gap-4 2k:gap-6 w-full h-fit pl-10` : ''} 
				${checkIfHangarOpen(hangar.id) ? 'bg-base-100 border-2 border-dashed border-slate-600' : ''}
				${checkIfHangarSelected(hangar.id, selectedHangars) && !sidebar ? 'bg-base-100 hover:bg-base-100' : 'hover:bg-base-200'}
				`}
				onMouseDown={() => {
					if (editable && !buildToAddToHangar) {
						setLongClickStart(dispatchHangars, new Date().getTime());
					}
				}}
				onMouseUp={() => {
					if (editable && !buildToAddToHangar) {
						handleHangarLongClick(hangar);
					}
				}}
				onBlur={e => {
					if (editable && !buildToAddToHangar) {
						handleHangarBlur(e, hangar);
					}
				}}
				onKeyDown={e => {
					if (editable) {
						handleHangarKeyPress(e, hangar);
					}
				}}
				onClick={e => {
					handleHangarClick(e, hangar);
					setLastSelectedHangar(dispatchHangars, hangar.id);
					if (pinnedHangar === hangar.id) {
						if (checkIfHangarSelected(hangar.id, selectedHangars)) {
							setPinnedHangar(dispatchHangars, null);
						}
					}
					if (hangarLocation === 'upload' && hangar.id !== 'your-builds') {
						setSelectedHangar(dispatchHangars, hangar, selectedHangars, buildToAddToHangar);
					} else if (hangarLocation !== 'upload') {
						setSelectedHangar(dispatchHangars, hangar, selectedHangars, buildToAddToHangar);
					}
				}}
			>
				<div className={`flex ${sidebar ? '2k:!gap-2' : ''} ${hangarView === 'list' ? 'flex-row gap-4' : 'flex-col'} items-center`}>
					<AnimatedSaveIcon hangar={hangar} buildAdded={buildAdded} />
					<AddToHangarCheckbox hangarID={hangar.id} sidebar={sidebar} />
					<PinHangarCheckbox hangar={hangar} sidebar={sidebar} />
					<SidebarHangarIcon hangar={hangar} sidebar={sidebar} hoverHangar={hoverHangar} />
					<HangarNameAndInput hangar={hangar} />

					{buildAdded && savingToHangar === hangar.id ? <p className="text-lg 2k:text-xl text-success truncate-2 unselectable font-bold mt-3 ">Saved!</p> : ''}
				</div>

				<DisplayBuildsAmount hangar={hangar} />
			</div>
		</div>
	);
}

export default Hangar;

/**
 * Save icon that pops up after a user drags a build onto a folder
 * @param {obj} hangar
 * @param {*} buildAdded
 */
const AnimatedSaveIcon = ({ hangar, buildAdded }) => {
	const { savingToHangar } = useHangarContext();

	if (buildAdded && savingToHangar === hangar.id) {
		<div className={`transition-all opacity-0 animate-saved rounded-full bg-success text-[#1f222b] absolute top-0 right-0 w-14 aspect-square flex items-center justify-center text-4xl drop-shadow-green`}>
			<FaSave />
		</div>;
	}
};

/**
 * Displays checkbox for adding a build to a hangar
 * @param {string} hangarID - the id of the hangar
 * @param {bool} sidebar
 * @returns
 */
const AddToHangarCheckbox = ({ hangarID, sidebar }) => {
	const { selectedHangars, buildToAddToHangar } = useHangarContext();
	const { dragBuild } = useBuildContext();

	if ((buildToAddToHangar && !sidebar) || (sidebar && dragBuild)) {
		return (
			<div className="absolute top-2 left-2 tooltip" data-tip="Add build to hangar">
				<span className="text-white text-2xl 2k:text-3xl hover:text-slate-400">{checkIfHangarSelected(hangarID, selectedHangars) ? <MdCheckBox /> : <MdOutlineCheckBoxOutlineBlank />}</span>
			</div>
		);
	}
};

/**
 * Checkbox for pinning a hangar to a build.
 * User can only change a pin for their own builds.
 * @param {obj} hangar
 * @param {bool} sidebar
 * @returns
 */
const PinHangarCheckbox = ({ hangar, sidebar }) => {
	const { dispatchHangars, pinnedHangar, buildToAddToHangar, selectedHangars } = useHangarContext();
	const { loadedBuild } = useBuildContext();
	const { user } = useAuthContext();
	const uploadLocation = useLocation().pathname.includes('upload');

	const handlePinHangarClick = e => {
		e.stopPropagation();
		setPinnedHangar(dispatchHangars, pinnedHangar === hangar.id ? null : hangar.id);

		if (pinnedHangar !== hangar.id) {
			if (!checkIfHangarSelected(hangar.id, selectedHangars)) {
				setSelectedHangar(dispatchHangars, hangar, selectedHangars, buildToAddToHangar);
			}
		}
	};

	//---------------------------------------------------------------------------------------------------//
	if ((buildToAddToHangar && !sidebar && hangar.id !== 'your-builds' && loadedBuild?.uid === user.uid) || uploadLocation) {
		return (
			<div className="absolute top-2 right-2 tooltip" data-tip={`${pinnedHangar === hangar.id ? 'Unpin hangar' : 'Pin hangar (displays this hangar on the builds page)'}`}>
				<span className="text-white text-2xl 2k:text-3xl hover:text-slate-400" onClick={handlePinHangarClick}>
					{pinnedHangar === hangar.id ? <AiFillPushpin /> : <AiOutlinePushpin />}
				</span>
			</div>
		);
	}
};

/**
 * handles displaying the icon in the sidebar hanger list
 * @param {bool} sidebar
 * @param {string} hoverHangar - the hanger being hovered over
 * @param {object} hangar - the hangar in question
 * @returns
 */
const SidebarHangarIcon = ({ sidebar, hoverHangar, hangar }) => {
	const { dragBuild } = useBuildContext();
	const { user } = useAuthContext();

	return (
		<>
			{sidebar && hoverHangar === hangar.id ? (
				<> {checkIfBuildInHangar(dragBuild, hangar.id, user) ? <HangarMinusIcon className="2k:w-16 w-10 2k:h-16 h-10 shrink-0" fill="#f23d4c" /> : <HangarPlusIcon className="2k:w-16 w-10 2k:h-16 h-10 shrink-0" fill="#36d399" />}</>
			) : (
				<HangarIcon className="2k:w-16 w-10 2k:h-16 h-10 shrink-0" fill="#a6adbb" />
			)}
		</>
	);
};

/**
 * Text input for renaming a hangar
 * @param {*} hangar
 * @returns
 */
const HangarNameAndInput = ({ hangar, sidebar }) => {
	const { editingHangar, editingHangarName, dispatchHangars } = useHangarContext();

	if (editingHangar && editingHangar.id === hangar.id) {
		return (
			<input
				type="text"
				id={`input-${editingHangar.id}`}
				className={`input text-lg 2k:text-xl ${editingHangarName.length > 50 ? 'text-red-500' : 'text-white'} bg-base-500 w-58 2k:w-66`}
				defaultValue={hangar.hangarName}
				autoFocus
				onChange={e => setEditingHangarName(dispatchHangars, e.target.value)}
			/>
		);
	} else {
		return <p className={`text-lg 2k:text-xl text-white truncate-2 unselectable`}>{hangar.hangarName}</p>;
	}
};

/**
 * Handles displaying the amount of builds in a hangar
 * @param {*} hangar
 * @returns
 */
const DisplayBuildsAmount = ({ hangar }) => {
	const { hangarView } = useHangarContext();

	return (
		<div className={`flex flex-row items-center justify-center text-lg 2k:text-2xl gap-2 lg:gap-3 text-center unselectable ${hangarView === 'list' ? 'pr-10' : ''} `}>
			<span className="text-center font-bold">{hangar.builds.length}</span> build{hangar.builds.length !== 1 && 's'}
		</div>
	);
};
