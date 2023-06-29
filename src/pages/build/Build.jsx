import React, { useEffect, useContext, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useNavigate, useLocation } from 'react-router-dom';
import { convertFromRaw, EditorState } from 'draft-js';
//---------------------------------------------------------------------------------------------------//
import useResetStates from '../../utilities/useResetStates';
//---------------------------------------------------------------------------------------------------//
import BuildContext from '../../context/build/BuildContext';
import AuthContext from '../../context/auth/AuthContext';
import useBuild, { setBuildOfTheWeek } from '../../context/build/BuildActions';
import { useFetchUser } from '../../context/auth/AuthActions';
//---------------------------------------------------------------------------------------------------//
import VoteArrows from '../../components/buttons/VoteArrows';
import Spinner1 from '../../components/spinners/Spinner1';
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
import IsAdmin from '../../components/credentials/IsAdmin';
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
//---------------------------------------------------------------------------------------------------//

function Build() {
	//---------------------------------------------------------------------------------------------------//
	const { fetchBuild } = useBuild();
	const { dispatchBuild, loadingBuild, loadedBuild, editingBuild } = useContext(BuildContext);
	const { user } = useContext(AuthContext);
	const [buildDesc, setBuildDesc] = useState(null);
	const { fetchUsersProfile } = useFetchUser();
	const { resetStates } = useResetStates();
	const location = useLocation();
	const navigate = useNavigate();
	const { id } = useParams();

	useEffect(() => {
		resetStates();
	}, []);

	// Fetch the build
	useEffect(() => {
		fetchBuild(id);
	}, [id]);

	useEffect(() => {
		if (!loadingBuild && loadedBuild) {
			if (loadedBuild.visibility === 'private' && user.uid !== loadedBuild.uid) {
				navigate('/');
			} else {
				setBuildDesc(EditorState.createWithContent(convertFromRaw(JSON.parse(loadedBuild.description))));
				fetchUsersProfile(loadedBuild.uid);
			}
		}
	}, [loadingBuild, loadedBuild]);

	//---------------------------------------------------------------------------------------------------//
	if (editingBuild) return <Create />;

	if (loadingBuild) {
		return (
			<MiddleContainer>
				<Spinner1 />
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
				<Helmet title={loadedBuild?.name ? loadedBuild?.name : 'Build'} pageLink={`https://kspbuilds.com/build/${location.pathname}`} description={`View the build '${loadedBuild.name}' by ${loadedBuild.author}.`} />
			)}

			<MiddleContainer>
				<div className="flex flex-col gap-4 w-full">
					<CheckCredentials type="admin">
						<Button text="Make build of the week" color="btn-primary" icon="fill-star" htmlFor="build-of-the-week-modal" onClick={() => setBuildOfTheWeek(dispatchBuild, loadedBuild)} />
					</CheckCredentials>

					<Carousel images={loadedBuild.images} />

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
						<div className="flex flex-col sm:flex-row flex-wrap items-center gap-4 mb-10 w-full">
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
