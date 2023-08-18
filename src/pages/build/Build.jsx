import React from 'react';
import { useParams } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
//---------------------------------------------------------------------------------------------------//
import useResetStates from '../../hooks/useResetStates';
//---------------------------------------------------------------------------------------------------//
import { useBuildContext } from '../../context/build/BuildContext';
import useFetchBuild, { setBuildOfTheWeek, useFetchBuildAuthorProfile, useNavigateIfPrivateBuild } from '../../context/build/BuildActions';
import { useFoldersContext } from '../../context/folders/FoldersContext';
//---------------------------------------------------------------------------------------------------//
import VoteArrows from '../../components/buttons/VoteArrows';
import Spinner2 from '../../components/spinners/Spinner2';
import DeleteBuildModal from '../../components/modals/DeleteBuildModal';
import MakeBuildOfTheWeekModal from '../../components/modals/MakeBuildOfTheWeekModal';
import Carousel from '../../components/carousel/Carousel';
import Create from '../upload/Upload';
import Button from '../../components/buttons/Button';
import CantFind from '../../components/cantFind/CantFind';
import MiddleContainer from '../../components/containers/middleContainer/MiddleContainer';
import Favorite from '../../components/buttons/Favorite';
import DeleteCommentModal from '../../components/modals/DeleteCommentModal';
import Helmet from '../../components/Helmet/Helmet';
import BuildInfo from './components/BuildInfo';
import BuildDescription from './components/BuildDescription';
import BuildName from './components/BuildName';
import BuildTypes from './components/BuildTypes';
import BuildViews from './components/BuildViews';
import ShareBuildBtn from './components/Buttons/ShareBuildBtn';
import ExportBuildBtn from '../../components/buttons/ExportBuildBtn';
import HowToImportBtn from './components/Buttons/HowToImportBtn';
import SaveBuildToFolderBtn from './components/Buttons/SaveBuildToFolderBtn';
import ReportBuildBtn from './components/Buttons/ReportBuildBtn';
import CheckCredentials from '../../components/credentials/CheckCredentials';
import EditBuildBtn from './components/Buttons/EditBuildBtn';
import DeleteBuildBtn from './components/Buttons/DeleteBuildBtn';
import BuildVideo from './components/BuildVideo';
import BuildComments from './components/BuildComments';
import ReturnHomeBtn from './components/Buttons/ReturnHomeBtn';
import BuildPinnedFolder from './components/BuildPinnedFolder';

function Build() {
	const { dispatchBuild, loadingBuild, loadedBuild, editingBuild } = useBuildContext();
	const { fetchedPinnedFolder } = useFoldersContext();
	const location = useLocation();
	const { id } = useParams();

	useResetStates();

	useFetchBuild(id);

	useNavigateIfPrivateBuild();
	useFetchBuildAuthorProfile();

	//---------------------------------------------------------------------------------------------------//
	if (editingBuild) return <Create />;

	if (loadingBuild) {
		return (
			<MiddleContainer>
				<Spinner2 />
			</MiddleContainer>
		);
	}

	if (!loadingBuild && !loadedBuild) {
		return (
			<MiddleContainer>
				<CantFind text="Oops.. Build not found">
					<ReturnHomeBtn />
				</CantFind>
			</MiddleContainer>
		);
	}

	return (
		<>
			{!loadingBuild && loadedBuild && (
				<Helmet
					title={loadedBuild?.name ? loadedBuild?.name : 'Build'}
					image={loadedBuild?.images[0]}
					type="article"
					pageLink={`https://kspbuilds.com/build/${location.pathname}`}
					description={`View the build '${loadedBuild.name}' by ${loadedBuild.author}.`}
				/>
			)}

			<MiddleContainer>
				<div className="flex flex-col gap-4 w-full">
					<CheckCredentials type="admin">
						<Button text="Make build of the week" color="btn-primary" icon="fill-star" htmlFor="build-of-the-week-modal" onClick={() => setBuildOfTheWeek(dispatchBuild, loadedBuild)} />
					</CheckCredentials>

					<div className="flex flex-col lg:flex-row w-full lg:h-61rem 2k:h-75rem gap-3 2k:gap-6">
						<div className={`flex h-full flex-col ${loadedBuild.pinnedFolder && fetchedPinnedFolder ? 'w-full lg:w-3/4' : 'w-full'}`}>
							<Carousel images={loadedBuild.images} />
						</div>
						<BuildPinnedFolder />
					</div>

					<BuildInfo />

					<BuildName />

					<div className="flex flex-row place-content-between flex-wrap mb-8 2k:mb-16">
						<BuildTypes />

						<div className="flex-row flex gap-4 2k:gap-8">
							<Favorite />
							<VoteArrows build={loadedBuild} />
							<BuildViews />
							<ShareBuildBtn />
						</div>
					</div>

					<BuildDescription />

					<div className="flex flex-col md:flex-row place-content-between">
						<div className="flex flex-row flex-wrap items-center gap-4 mb-10 w-full">
							<ExportBuildBtn id={loadedBuild.id} />
							<HowToImportBtn />
							<SaveBuildToFolderBtn />
							<ReportBuildBtn />
						</div>

						<CheckCredentials type="buildOwner">
							<div className="flex flex-row gap-4">
								<EditBuildBtn />
								<DeleteBuildBtn />
							</div>
						</CheckCredentials>
					</div>

					<BuildVideo />

					<BuildComments />
				</div>

				<DeleteBuildModal id={loadedBuild.id} userID={loadedBuild.uid} />
				<MakeBuildOfTheWeekModal />
				<DeleteCommentModal />
			</MiddleContainer>
		</>
	);
}

export default Build;
