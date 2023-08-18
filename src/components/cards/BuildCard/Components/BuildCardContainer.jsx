import React from 'react';
import { setDragBuild } from '../../../../context/build/BuildActions';
import { useBuildContext } from '../../../../context/build/BuildContext';
import { useFoldersContext } from '../../../../context/folders/FoldersContext';
import { useAuthContext } from '../../../../context/auth/AuthContext';
import { setBuildToAddToFolder } from '../../../../context/folders/FoldersActions';
import DragImg from '../../../../assets/build_drag_grid_img.png';

/**
 * Displays the container for the build card
 * @param {*} children
 * @param {obj} build
 * @param {obj} setHover - state setters for hover
 * @param {obj} setHoverAnim - state setters for hover
 * @returns
 */
function BuildCardContainer({ children, build, setHoverAnim, setHover }) {
	const { dispatchBuild } = useBuildContext();
	const { dispatchFolders } = useFoldersContext();
	const { user } = useAuthContext();

	const handleHover = state => {
		setHoverAnim(state);

		setTimeout(() => {
			setHover(state);
		}, 100);
	};

	/**
	 * Handles dragging a build (not onto a folder)
	 * @param {*} e
	 */
	const drag = e => {
		setBuildToAddToFolder(dispatchFolders, build.id, user);
		setDragBuild(dispatchBuild, build.id);
		e.dataTransfer.setData('text', build.id);
		const img = new Image();
		img.src = DragImg;
		e.dataTransfer.setDragImage(img, 150, 150);
	};

	/**
	 * Handles dropping a build (not onto a folder)
	 * @param {*} e
	 */
	const drop = e => {
		setBuildToAddToFolder(dispatchFolders, null, user);
		setDragBuild(dispatchBuild, null);
	};

	return (
		<div
			id={build.id}
			draggable={true}
			onDragStart={drag}
			onDragEnd={drop}
			className="flex p-2 2k:p-4 max-w-xl aspect-square md:aspect-5/6 xl:aspect-square 2k:aspect-5/6' shadow-lg hover:shadow-xl w-full relative"
			onMouseEnter={() => handleHover(build.urlName)}
			onMouseLeave={() => handleHover(false)}
		>
			{children}
		</div>
	);
}

export default BuildCardContainer;
