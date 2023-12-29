import React, { useState } from 'react';
import Favorite from '../../buttons/Favorite';
import BuildCardTypes from './Components/BuildCardTypes';
import BuildCardViews from './Components/BuildCardViews';
import BuildCardComments from './Components/BuildCardComments';
import BuildCardDownloads from './Components/BuildCardDownloads';
import BuildCardReportBtn from './Buttons/BuildCardReportBtn';
import BuildCardUploadDate from './Components/BuildCardUploadDate';
import BuildCardName from './Components/BuildCardName';
import BuildCardImage from './Components/BuildCardImage';
import BuildCardExportBtn from './Buttons/BuildCardExportBtn';
import BuildCardVoting from './Components/BuildCardVoting';
import { setDragBuild } from '../../../context/build/BuildActions';
import { useBuildContext } from '../../../context/build/BuildContext';
import { setBuildToAddToHangar } from '../../../context/hangars/HangarActions';
import { useHangarContext } from '../../../context/hangars/HangarContext';
import { useAuthContext } from '../../../context/auth/AuthContext';
import DragImg from '../../../assets/build_drag_grid_img.png';
import BuildCardSaved from './Components/BuildCardSaved';

/**
 * Displays a build card in list form
 * @param {obj} build - the build to display
 * @returns
 */
function ListBuildCard({ build }) {
	const [hover, setHover] = useState(false);
	const { dispatchBuild } = useBuildContext();
	const { dispatchHangars } = useHangarContext();
	const { user } = useAuthContext();

	const drag = e => {
		setDragBuild(dispatchBuild, build.id);
		setBuildToAddToHangar(dispatchHangars, build.id, user);
		e.dataTransfer.setData('text', build.id);
		const img = new Image();
		img.src = DragImg;
		e.dataTransfer.setDragImage(img, 150, 150);
	};

	/**
	 * Handles dropping a build (not onto a hangar)
	 * @param {*} e
	 */
	const drop = e => {
		setBuildToAddToHangar(dispatchHangars, null, user);
		setDragBuild(dispatchBuild, null);
	};

	return (
		<a
			id={build.id}
			href={`/build/${build.urlName}`}
			className="flex flex-row gap-4 2k:gap-6 w-full bg-base-300 cursor-pointer h-80 lg:h-44 rounded-lg p-4 hover:shadow-lg relative"
			onMouseEnter={() => setHover(true)}
			onMouseLeave={() => setHover(false)}
			draggable={true}
			onDragStart={drag}
			onDragEnd={drop}
		>
			<BuildCardVoting build={build} />
			<BuildCardImage build={build} />
			<div className="flex flex-col gap-3 2k:gap-4 w-full h-full">
				<BuildCardName name={build.name} />
				<div className="flex flex-row flex-wrap gap-4 2k:gap-6">
					<BuildCardUploadDate build={build} />
					<BuildCardTypes types={build.types} />
				</div>
				<div className="flex flex-row gap-4 2k:gap-6 flex-wrap">
					<BuildCardViews views={build.views} />
					<BuildCardComments commentCount={build.commentCount} />
					<BuildCardDownloads downloads={build.downloads} />
					<BuildCardSaved id={build.id} />
					<Favorite id={build.id} text="favorite" />
					<BuildCardReportBtn build={build} />
				</div>
			</div>

			<BuildCardExportBtn hover={hover} buildId={build.id} />
		</a>
	);
}

export default ListBuildCard;
