import React, { useState, useContext, useEffect } from 'react';
import { FaFolder, FaPlus } from 'react-icons/fa';
import { useLocation, useNavigate } from 'react-router-dom';
import AuthContext from '../../context/auth/AuthContext';
import FoldersContext from '../../context/folders/FoldersContext';
import { setMakingNewFolder, setFolderView, setDeleteFolder, setEditingFolderName, setEditingFolder, setOpenedFolder } from '../../context/folders/FoldersActions';
import { handleShareFolder } from '../../context/folders/FoldersUtilils';
import { buildNameToUrl } from '../../utilities/buildNameToUrl';
import Button from '../buttons/Button';
import useBuilds from '../../context/builds/BuildsActions';
import Folder from './Folder';

/**
 * Displays a styled list of users folders
 * @returns
 */
function Folders({ usersFolders, editable, hideOwnFolder }) {
	const location = useLocation();
	const navigate = useNavigate();
	let currentLocation = location.pathname.split('/')[1];
	const [currentUser, setCurrentUser] = useState(location.pathname.split('/')[2]);
	//---------------------------------------------------------------------------------------------------//
	const [ownBuildsFolder, setOwnBuildsFolder] = useState({ id: 'your-builds', folderName: 'Your Builds', builds: [], urlName: '' });
	const [usersBuildsFolder, setUsersBuildsFolder] = useState({ id: 'users-builds', folderName: '', builds: [], urlName: '' });
	const [collapsedFolders, setCollapsedFoldrers] = useState(false);
	//---------------------------------------------------------------------------------------------------//
	const { openedFolder, makingNewFolder, folderView, dispatchFolders, addToFolderModalOpen } = useContext(FoldersContext);
	const { user, authLoading, fetchedUserProfile, fetchingProfile } = useContext(AuthContext);
	//---------------------------------------------------------------------------------------------------//
	const { fetchBuildsById } = useBuilds();

	useEffect(() => {
		if (currentLocation !== 'user') {
			if (!authLoading && user?.username) {
				if (!currentUser) {
					setCurrentUser(user.username);
				}
				setOwnBuildsFolder(prevState => {
					return {
						...prevState,
						builds: user.builds,
					};
				});
			}
		}
	}, [authLoading]);

	useEffect(() => {
		if (currentLocation === 'user') {
			if (!fetchingProfile && fetchedUserProfile) {
				setUsersBuildsFolder(prevState => {
					return {
						...prevState,
						builds: fetchedUserProfile.builds,
						folderName: `${fetchedUserProfile.username}'s Builds`,
						id: `${buildNameToUrl(fetchedUserProfile.username)}s-builds`,
						urlName: `${buildNameToUrl(fetchedUserProfile.username)}s-builds`,
					};
				});
			}
		}
	}, [fetchingProfile]);

	//---------------------------------------------------------------------------------------------------//
	return (
		<div className="flex flex-col gap-4 w-full rounded-xl p-6 2k:p-8 bg-base-300 mb-10">
			<div className="flex flex row place-content-between">
				<div className="text-xl 2k:text-2xl breadcrumbs">
					<ul>
						<li
							onClick={() => {
								setOpenedFolder(dispatchFolders, null);
								if (currentLocation === 'user') {
									navigate(`/user/${currentUser}`);
									fetchBuildsById(fetchedUserProfile.builds, fetchedUserProfile.uid, 'user');
								} else if (currentLocation === 'profile') {
									fetchBuildsById(user.builds, user.uid, 'user');
								}
							}}
						>
							<a className="flex flex-row gap-2">
								<FaFolder /> Folders
							</a>
						</li>
						{openedFolder ? (
							<li>
								<a className="flex flex-row gap-2">
									<FaFolder /> {openedFolder.folderName}
								</a>
							</li>
						) : null}
					</ul>
				</div>

				{/* View buttons */}
				<div className="flex flex-row text-3xl 2k:text-4xl">
					{openedFolder && (currentLocation !== 'user' || addToFolderModalOpen) && openedFolder.id !== 'your-builds' ? (
						<Button
							tooltip="Rename Folder"
							color="btn-ghost"
							icon="edit"
							onClick={() => {
								setEditingFolder(dispatchFolders, openedFolder);
								setEditingFolderName(dispatchFolders, openedFolder.folderName);
							}}
						/>
					) : null}
					{openedFolder && (currentLocation !== 'user' || addToFolderModalOpen) && openedFolder.id !== 'your-builds' ? (
						<Button tooltip="Delete Folder" color="btn-ghost" icon="delete" onClick={() => setDeleteFolder(dispatchFolders, openedFolder.id, openedFolder.folderName)} />
					) : null}
					<Button tooltip="List View" color={`btn-ghost ${folderView === 'list' ? 'text-white' : ''}`} icon="list" onClick={() => setFolderView(dispatchFolders, 'list')} />
					<Button tooltip="Grid View" color={`btn-ghost ${folderView === 'grid' ? 'text-white' : ''}`} icon="grid" onClick={() => setFolderView(dispatchFolders, 'grid')} />
					{openedFolder ? <Button tooltip="Share Folder" color="btn-ghost" icon="share" onClick={() => handleShareFolder(currentUser, openedFolder.urlName)} /> : null}
					<Button tooltip="Collapse Folders" color="btn-ghost" icon={`${collapsedFolders ? 'down2' : 'up2'}`} onClick={() => setCollapsedFoldrers(!collapsedFolders)} />
				</div>
			</div>

			<div className="w-full h-1 border-b-2 border-dashed border-slate-600"></div>

			{!collapsedFolders ? (
				<div className={`flex ${folderView === 'grid' && 'flex-row'} ${folderView === 'list' && 'flex-col'}  flex-wrap gap-2 w-full`}>
					{usersFolders ? (
						<>
							{currentLocation === 'user' ? <Folder folder={usersBuildsFolder} editable={false} /> : null}
							{usersFolders?.map(folder => {
								return <Folder key={folder.id} folder={folder} editable={editable} />;
							})}
						</>
					) : (
						<>
							{!hideOwnFolder ? <Folder folder={ownBuildsFolder} editable={false} /> : null}

							{user?.folders?.map(folder => {
								return <Folder key={folder.id} folder={folder} editable={editable} />;
							})}

							{makingNewFolder ? <Folder type="new" /> : null}

							{user?.folders?.length <= 20 && !openedFolder ? (
								<div className="tooltip" data-tip="New Folder">
									<label
										className={`text-5xl flex flex-col items-center justify-center cursor-pointer ${folderView === 'list' ? 'h-fit w-full py-2 bg-base-400 ' : 'h-28 aspect-square'} hover:bg-base-200 rounded-xl`}
										onClick={() => setMakingNewFolder(dispatchFolders, true)}
									>
										<FaPlus />
									</label>
								</div>
							) : null}
						</>
					)}
				</div>
			) : null}
		</div>
	);
}

export default Folders;
