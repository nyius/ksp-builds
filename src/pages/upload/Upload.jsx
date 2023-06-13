import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { cloneDeep } from 'lodash';
import { v4 as uuidv4 } from 'uuid';
//---------------------------------------------------------------------------------------------------//
import { standardBuild } from '../../utilities/standardBuild';
//---------------------------------------------------------------------------------------------------//
import AuthContext from '../../context/auth/AuthContext';
import { useUpdateBuild, useUploadBuild, setBuildToUpload } from '../../context/build/BuildActions';
import FoldersContext from '../../context/folders/FoldersContext';
import { setBuildToAddToFolder } from '../../context/folders/FoldersActions';
import BuildContext from '../../context/build/BuildContext';
//---------------------------------------------------------------------------------------------------//
import Spinner1 from '../../components/spinners/Spinner1';
import LogoBackground from '../../assets/logo_bg_dark.png';
import Button from '../../components/buttons/Button';
import MiddleContainer from '../../components/containers/middleContainer/MiddleContainer';
import CancelBuildEditModal from '../../components/modals/CancelBuildEditModal';
import PlanetHeader from '../../components/header/PlanetHeader';
import Helmet from '../../components/Helmet/Helmet';
import UploadBuildImages from './Components/UploadBuildImages';
import UploadBuildName from './Components/UploadBuildName';
import UploadBuildVersion from './Components/UploadBuildVersion';
import UploadBuildVisibility from './Components/UploadBuildVisibility';
import UploadBuildChallenge from './Components/UploadBuildChallenge';
import UploadBuildMods from './Components/UploadBuildMods';
import UploadBuildDesc from './Components/UploadBuildDesc';
import UploadBuildVideo from './Components/UploadBuildVideo';
import UploadBuildTypes from './Components/UploadBuildTypes';
import UploadBuildTags from './Components/UploadBuildTags';
import UploadBuildFolders from './Components/UploadBuildFolders';
import UploadBuildRawBuild from './Components/UploadBuildRawBuild';
import SubmitBtn from './Components/Buttons/SubmitBtn';
import CancelEditBtn from './Components/Buttons/CancelEditBtn';
import UpdateBuildBtn from './Components/Buttons/UpdateBuildBtn';

/**
 * Handles displaying the container for creating & editing a build.
 * @param {*} param0
 * @returns
 */
function Upload() {
	const buildId = uuidv4().slice(0, 30);
	const { user, authLoading } = useContext(AuthContext);
	const { dispatchBuild, editingBuild, uploadingBuild, buildToUpload } = useContext(BuildContext);
	const { dispatchFolders } = useContext(FoldersContext);
	const { uploadBuild } = useUploadBuild();
	//---------------------------------------------------------------------------------------------------//
	const navigate = useNavigate();

	useEffect(() => {
		setBuildToUpload(dispatchBuild, editingBuild ? cloneDeep(editingBuild) : cloneDeep(standardBuild));
	}, []);

	useEffect(() => {
		if (!authLoading && user?.username) {
			setBuildToAddToFolder(dispatchFolders, buildId, user);
		}
	}, [authLoading]);

	/**
	 * Handles submitting the build
	 */
	const submitBuild = async e => {
		e.preventDefault();
		try {
			const makeReadyBuild = cloneDeep(buildToUpload);

			let newTags = [];
			makeReadyBuild.tags.map(tag => {
				newTags.push(tag.trim());
			});

			makeReadyBuild.id = buildId;
			makeReadyBuild.name = makeReadyBuild.name.trim();
			makeReadyBuild.tags = newTags;
			makeReadyBuild.images.length === 0 && (makeReadyBuild.images = [LogoBackground]);
			makeReadyBuild.author = user.username;
			makeReadyBuild.uid = user.uid;
			if (makeReadyBuild.rawImageFiles.length > 0) {
				makeReadyBuild.thumbnail = makeReadyBuild.rawImageFiles[0];
			}

			const newBuildId = await uploadBuild(makeReadyBuild);
			if (newBuildId) {
				navigate(`/build/${newBuildId}`);
			}
		} catch (error) {
			toast.error('Something went wrong!');
			console.log(error);
		}
	};

	//---------------------------------------------------------------------------------------------------//
	if (uploadingBuild) {
		return (
			<MiddleContainer>
				<div className="flex flex-col items-center justify-cener">
					<p className="text-2xl 2k:text-4xl font-bold">Uploading Build</p>
					<Spinner1 />
				</div>
			</MiddleContainer>
		);
	}

	return (
		<>
			<Helmet title="Upload a Build" pageLink="https://kspbuilds.com/upload" />

			<MiddleContainer>
				{buildToUpload && (
					<>
						<PlanetHeader text={editingBuild ? 'Edit Build' : 'Create Build'} />

						<form onSubmit={submitBuild} method="POST" encType="multipart/form-data">
							<UploadBuildImages />

							<div className="flex flex-row flex-wrap gap-16 mb-10 2k:mb-20">
								<UploadBuildName />
								<UploadBuildVersion />
								<UploadBuildVisibility />
								<UploadBuildChallenge />
								<UploadBuildMods />
							</div>

							<UploadBuildDesc />
							<UploadBuildVideo />
							<UploadBuildTypes />
							<UploadBuildTags />
							<UploadBuildFolders />
							<UploadBuildRawBuild />

							{editingBuild ? (
								<div className="flex flex-row gap-4 2k:gap-10">
									<UpdateBuildBtn />
									<CancelEditBtn />
								</div>
							) : (
								<SubmitBtn />
							)}
							<CancelBuildEditModal />
						</form>
					</>
				)}
			</MiddleContainer>
		</>
	);
}

export default Upload;
