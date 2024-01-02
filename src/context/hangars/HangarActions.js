import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useHangarContext } from './HangarContext';
import { useAuthContext } from '../auth/AuthContext';
import { doc, updateDoc } from 'firebase/firestore';
import { toast } from 'react-toastify';
import { v4 as uuidv4 } from 'uuid';
import { setFetchingProfile, updateUserState, useFetchUser } from '../auth/AuthActions';
import { cloneDeep } from 'lodash';
import { db } from '../../firebase.config';
import { profanity } from '@2toad/profanity';
import { buildNameToUrl } from '../../utilities/buildNameToUrl';
import { checkForSameNameHangar, checkIfBuildInHangar } from './HangarUtils';
import { setLocalStoredUser } from '../../utilities/userLocalStorage';
import { useBuildContext } from '../build/BuildContext';
import { useUpdateBuild } from '../build/BuildActions';
import { useEffect, useState } from 'react';
import useBuilds from '../builds/BuildsActions';
import errorReport from '../../utilities/errorReport';

/**
 * Hook with functions for adding a new hangar
 * @returns
 */
function useAddNewHangar() {
	const { dispatchHangars, newHangarName } = useHangarContext();
	const { user, dispatchAuth } = useAuthContext();

	/**
	 * Handles making a new Hangar
	 */
	const handleAddNewHangar = () => {
		if (!newHangarName || newHangarName.trim() === '') {
			setNewHangarName(dispatchHangars, '');
			setMakingNewHangar(dispatchHangars, false);
			toast.error('Hangar needs a name!');
			errorReport(`Hangar needs a name!`, false, 'handleAddNewHangar');
			return;
		}

		if (newHangarName.length > 50) {
			toast.error('Hangar name too long!');
			errorReport(`Hangar name too long!`, false, 'handleAddNewHangar');
			return;
		}

		if (profanity.exists(newHangarName)) {
			toast.error('Hangar name not acceptable!');
			errorReport(`Hangar name  not acceptable`, false, 'handleAddNewHangar');
			return;
		}

		addNewHangar(newHangarName);
		setNewHangarName(dispatchHangars, '');
		setMakingNewHangar(dispatchHangars, false);
	};

	/**
	 * Handles adding a new hangar
	 * @param {string} hangarName
	 */
	const addNewHangar = async hangarName => {
		try {
			const id = uuidv4().slice(0, 20);
			let sameNameCount = checkForSameNameHangar(user.hangars, hangarName);
			let urlName;
			if (sameNameCount > 0) {
				urlName = buildNameToUrl(hangarName + '-' + sameNameCount);
			} else {
				urlName = buildNameToUrl(hangarName);
			}

			const newHangar = { hangarName, id, builds: [], urlName };

			updateUserState(dispatchAuth, { hangars: user.hangars ? [...user.hangars, newHangar] : [newHangar] });

			await updateDoc(doc(db, 'users', user.uid), { hangars: user.hangars ? [...user.hangars, newHangar] : [newHangar] });
			await updateDoc(doc(db, 'userProfiles', user.uid), { hangars: user.hangars ? [...user.hangars, newHangar] : [newHangar] });

			toast.success('hangar added!');
		} catch (error) {
			errorReport(error.message, true, 'addNewHangar');
			toast.error('Something went wrong, please try again');
		}
	};

	return {
		handleAddNewHangar,
	};
}

/**
 * Hook for deleting a hangar
 * @returns
 */
export const useDeleteHangar = () => {
	const { user, dispatchAuth } = useAuthContext();
	const { dispatchHangars, deleteHangarId } = useHangarContext();

	/**
	 * Handles deleting a hangar
	 */
	const deleteHangar = async () => {
		try {
			const newHangars = user.hangars.filter(hangar => hangar.id !== deleteHangarId);
			setDeleteHangar(dispatchHangars, null, null);
			updateUserState(dispatchAuth, { hangars: newHangars });
			setOpenedHangar(dispatchHangars, null);

			await updateDoc(doc(db, 'users', user.uid), { hangars: newHangars });
			await updateDoc(doc(db, 'userProfiles', user.uid), { hangars: newHangars });
			toast.success('hangar deleted.');
		} catch (error) {
			errorReport(error.message, true, 'useDeleteHangar');
			toast.error('Something went wrong, please try again');
		}
	};

	return { deleteHangar };
};
/**
 * Hook for adding a build to a hangar
 * @returns
 */
export const useAddBuildToHangar = () => {
	const { user } = useAuthContext();
	const { dispatchHangars, selectedHangars } = useHangarContext();
	const { updateAllHangars } = useUpdateHangar();
	const { loadedBuild } = useBuildContext();
	const { updateBuild } = useUpdateBuild();

	/**
	 * handles adding a build to a hangar/Hangars
	 * @param {string} buildId - buildId of build to add
	 * @param {string} hangarId - (optional) the id of the hangar to add the build to. (if no hangarId supplied, it will add the build to all hangars currently selected)
	 */
	const addBuildToHangar = async (buildId, hangarId) => {
		try {
			let newHangars = cloneDeep(selectedHangars);
			let usersHangars = cloneDeep(user.hangars);
			setSavingToHangar(dispatchHangars, hangarId ? hangarId : true);
			setTimeout(() => {
				setSavingToHangar(dispatchHangars, false);
			}, 1500);

			if (hangarId) {
				// Loop over the users existing hangars
				usersHangars?.map(hangar => {
					// check if a hangar contains the build we want to save
					if (hangar.builds.includes(buildId)) {
						// See if this hangar is the hangar we want to save to.
						// if it is, that means that the user wants to remove the build from that hangar
						if (hangar.id === hangarId) {
							const buildIndex = hangar.builds.indexOf(buildId);
							hangar.builds.splice(buildIndex, 1);
							toast.success('Build Removed.');

							// Check if the build has the hangar pinned. If it does, remove the pin from the hangar
							if (loadedBuild) {
								if (loadedBuild.pinnedHangar === hangar.id) {
									const buildToUpdate = cloneDeep(loadedBuild);
									buildToUpdate.pinnedHangar = null;

									updateBuild(buildToUpdate);
								}
							}
						}
					} else {
						// if the hangar doesnt include the builds id, check if we have this hangar selected.
						// If we do have this hangar selected, add the build to it
						if (hangar.id === hangarId) {
							hangar.builds.push(buildId);
							toast.success('Build Saved!');
						}
					}
				});
			} else {
				// Loop over the users existing hangars
				usersHangars?.map(hangar => {
					// check if a hangar contains the build we want to save
					if (hangar.builds.includes(buildId)) {
						// If this existing hangar contains our build, see if we have this hangar selected
						// If this hangar was not selected but contains the build, it means the user wants to remove the build from this hangar
						const hangarIndex = newHangars.findIndex(newHangar => newHangar.id !== 'your-builds' && newHangar.id === hangar.id);

						if (hangarIndex < 0) {
							const buildIndex = hangar.builds.indexOf(buildId);
							hangar.builds.splice(buildIndex, 1);

							// Check if the build has the hangar pinned. If it does, remove the pin from the hangar
							if (loadedBuild) {
								if (loadedBuild.pinnedHangar === hangar.id) {
									const buildToUpdate = cloneDeep(loadedBuild);
									buildToUpdate.pinnedHangar = null;

									updateBuild(buildToUpdate);
								}
							}
						}
					} else {
						// if the hangar doesnt include the builds id, check if we have this hangar selected.
						// If we do have this hangar selected, add the build to it
						const hangarIndex = newHangars.findIndex(newHangar => newHangar.id !== 'your-builds' && newHangar.id === hangar.id);
						if (hangarIndex >= 0) {
							hangar.builds.push(buildId);
						}
					}
				});
				toast.success('Hangars Saved!');
			}

			await updateAllHangars(usersHangars);
			setSelectedHangar(dispatchHangars, null);
			setOpenedHangar(dispatchHangars, null);
			setAddBuildToHangarModal(dispatchHangars, false);
			setMakingNewHangar(dispatchHangars, false);
			setNewHangarName(dispatchHangars, null);
		} catch (error) {
			errorReport(error.message, true, 'addBuildToHangar');
			toast.error('Something went wrong, please try again');
		}
	};

	return { addBuildToHangar };
};

/**
 * Hook for handling hangar clicks
 * @returns
 */
export const useHandleHangarInteraction = () => {
	const { dispatchHangars, makingNewHangar, editingHangar, lastClickTime, selectedHangars, editingHangarName, longClickStart, lastSelectedHangarId, openedHangar } = useHangarContext();
	const { updateHangar } = useUpdateHangar();
	const { handleAddNewHangar } = useAddNewHangar();
	const navigate = useNavigate();
	const location = useLocation();

	/**
	 * handles double clicking a hangar to open it
	 * @param {*} e
	 * @param {obj} hangar
	 */
	const handleHangarClick = (e, hangar) => {
		const currentTime = new Date().getTime();

		if (editingHangar) {
			if (e.target.id !== `input-${hangar.id}`) {
				checkIfEditingHangar();
			}
		}
		if (lastClickTime > 0) {
			if (currentTime - lastClickTime < 400 && hangar.id === lastSelectedHangarId) {
				setOpenedHangar(dispatchHangars, hangar);

				const currentLocation = location.pathname.split('/')[1];

				if (currentLocation === 'user') {
					const currentUserId = location.pathname.split('/')[2];

					navigate(`/user/${currentUserId}/hangar/${hangar.urlName}`);
				} else {
					if (hangar.id === 'your-builds') {
						navigate(`/profile`);
					} else {
						navigate(`/profile/hangar/${hangar.urlName}`);
					}
				}
			} else {
				setLastClickTime(dispatchHangars, currentTime);
			}
		} else {
			setLastClickTime(dispatchHangars, currentTime);
		}
	};

	/**
	 * Handles a key being pressed while a hangar is selected
	 * @param {event} e
	 * @param {obj} hangar
	 */
	const handleHangarKeyPress = (e, hangar) => {
		if (selectedHangars) {
			if (editingHangarName) {
				if (e.key === 'Enter') {
					if (editingHangarName !== hangar.hangarName) {
						const newHangar = cloneDeep(hangar);
						newHangar.hangarName = editingHangarName;
						updateHangar(newHangar);
						setEditingHangar(dispatchHangars, false);
						setEditingHangarName(dispatchHangars, null);
					} else {
						setEditingHangar(dispatchHangars, false);
						setEditingHangarName(dispatchHangars, null);
					}
				} else if (e.key === 'Escape') {
					setEditingHangar(dispatchHangars, false);
					setEditingHangarName(dispatchHangars, null);
				}
			} else {
				if (e.key === 'F2') {
					setEditingHangar(dispatchHangars, hangar);
					setEditingHangarName(dispatchHangars, hangar.hangarName);
				} else if (e.key === 'Delete') {
					setDeleteHangar(dispatchHangars, hangar.id, hangar.hangarName);
				} else if (e.key === 'Enter') {
					setOpenedHangar(dispatchHangars, hangar);
				}
			}
		}
	};

	/**
	 * Handles checking if the user wants to rename the hangar VIA long mouse click (like in windows explorer)
	 * @param {obj} hangar
	 */
	const handleHangarLongClick = hangar => {
		if (longClickStart > 0) {
			const endTime = new Date().getTime();

			if (endTime - longClickStart > 600) {
				setEditingHangar(dispatchHangars, hangar);
				setEditingHangarName(dispatchHangars, hangar.hangarName);
			} else {
				setLongClickStart(dispatchHangars, 0);
			}
		}
	};

	/**
	 * Handles when a user clicks off of a hangar and we need to save any name changes
	 * @param {event} e
	 */
	const handleHangarBlur = e => {
		if (!e.relatedTarget) {
			setSelectedHangar(dispatchHangars, null);
			checkIfEditingHangar();
		}
	};

	/**
	 * Handles a key being pressed while making a new hangar
	 * @param {event} e
	 */
	const handleNewHangarKeyPress = e => {
		if (makingNewHangar) {
			if (e.key === 'Enter') {
				handleAddNewHangar();
			} else if (e.key === 'Escape') {
				setNewHangarName(dispatchHangars, '');
				setMakingNewHangar(dispatchHangars, false);
			}
		}
	};

	/**
	 * Handles when user clicks off making a new hangar
	 * @param {evene} e
	 */
	const handleNewHangarBlur = e => {
		if (!e.relatedTarget || e.relatedTarget?.parentElement.id.includes('tooltip')) {
			handleAddNewHangar();
		}
	};

	/**
	 * Checks if a hangar is being edited, and if it is to either save the changes or discard them
	 */
	const checkIfEditingHangar = () => {
		if (editingHangar) {
			if (editingHangarName !== editingHangar.hangarName) {
				const newHangar = cloneDeep(editingHangar);
				newHangar.hangarName = editingHangarName;
				updateHangar(newHangar);
				setEditingHangar(dispatchHangars, false);
				setEditingHangarName(dispatchHangars, null);
			} else {
				setEditingHangar(dispatchHangars, false);
				setEditingHangarName(dispatchHangars, null);
			}
		}
	};

	/**
	 *Checks if a hangar is open
	 * @param {stirng} id - the id of the hangar to check
	 */
	const checkIfHangarOpen = id => {
		if (openedHangar) {
			return openedHangar.id === id;
		}
	};

	return { handleHangarClick, handleHangarLongClick, handleHangarBlur, handleHangarKeyPress, handleNewHangarBlur, handleNewHangarKeyPress, checkIfHangarOpen };
};

/**
 * Hook that contains functions to update hangars on the server
 */
export const useUpdateHangar = () => {
	const { user, dispatchAuth } = useAuthContext();

	/**
	 * handles updating a single hangar
	 * @param {obj} updatedHangar - the updated hangar
	 */
	const updateHangar = async updatedHangar => {
		try {
			const updatedHangarIndex = user.hangars.findIndex(hangar => hangar.id === updatedHangar.id);
			const newHangars = cloneDeep(user.hangars);
			if (newHangars[updatedHangarIndex].hangarName !== updatedHangar.hangarName) {
				if (!updatedHangar.hangarName || updatedHangar.hangarName.trim() === '') {
					toast.error('hangar needs a name!');
					errorReport(`hangar needs a name!`, false, 'updateHangar');
					return;
				}

				if (updatedHangar.hangarName.length > 50) {
					toast.error('hangar name too long!');
					errorReport(`hangar name too long!`, false, 'updateHangar');
					return;
				}

				if (profanity.exists(updatedHangar.hangarName)) {
					toast.error('hangar name not acceptable!');
					errorReport(`hangar name  not acceptable`, false, 'updateHangar');
					return;
				}

				let sameNameCount = checkForSameNameHangar(newHangars, updatedHangar.hangarName);
				if (sameNameCount > 1) {
					updatedHangar.urlName = buildNameToUrl(updatedHangar.hangarName + '-' + sameNameCount);
				} else {
					updatedHangar.urlName = buildNameToUrl(updatedHangar.hangarName);
				}
			}

			newHangars[updatedHangarIndex] = updatedHangar;

			updateUserState(dispatchAuth, { hangars: newHangars });

			await updateDoc(doc(db, 'users', user.uid), { hangars: newHangars });
			await updateDoc(doc(db, 'userProfiles', user.uid), { hangars: newHangars });
			setLocalStoredUser(user.uid, user);

			toast.success('hangar Updated!');
		} catch (error) {
			errorReport(error.message, true, 'updateHangar');
			toast.error('Something went wrong, please try again');
		}
	};

	/**
	 * Handles updaing all of the hangars ath the same time. takes in an array of all of the hangars
	 * @param {arr} newHangars
	 */
	const updateAllHangars = async newHangars => {
		try {
			const updatedUser = cloneDeep(user);
			updateUserState(dispatchAuth, { hangars: newHangars });
			updatedUser.hangars = newHangars;

			await updateDoc(doc(db, 'users', user.uid), { hangars: newHangars });
			await updateDoc(doc(db, 'userProfiles', user.uid), { hangars: newHangars });
			setLocalStoredUser(user.uid, updatedUser);
		} catch (error) {
			errorReport(error.message, true, 'updateAllHangars');
			toast.error('Something went wrong, please try again');
		}
	};

	return { updateHangar, updateAllHangars };
};

/**
 * handles setting the hangars we are viewing owner
 */
export const useSetCurrentHangarOwner = () => {
	const location = useLocation();
	let currentUser = location.pathname.split('/')[2];
	//---------------------------------------------------------------------------------------------------//
	const { hangarLocation, dispatchHangars } = useHangarContext();
	const { user } = useAuthContext();

	useEffect(() => {
		if (hangarLocation === 'user') {
			setCurrentHangarOwner(dispatchHangars, currentUser);
		} else if (hangarLocation === 'profile' || hangarLocation === 'popup' || hangarLocation === 'upload') {
			setCurrentHangarOwner(dispatchHangars, user?.username);
		}
	}, [hangarLocation, dispatchHangars, currentUser, user]);

	useEffect(() => {
		if (hangarLocation !== 'user') {
			setUsersHangars(dispatchHangars, null);
		}
	}, [hangarLocation, dispatchHangars]);
};

/**
 * Handles clearing the current open hangar
 */
export const useResetOpenHangar = () => {
	const { dispatchHangars } = useHangarContext();
	useEffect(() => {
		setOpenedHangar(dispatchHangars, null);
	}, []);
};

/**
 * Handles setting if the users own personal hangar (Likes "Nyius's builds") should be hidden or visible
 * This is hidden where we dont want the user to add someone elses build to their own personal builds list
 * @param {bool} initialState
 * @returns
 */
export const useHideOwnHangar = initialState => {
	const { hangarLocation } = useHangarContext();
	const [hideOwnHangar, setHideOwnHangar] = useState(initialState);

	useEffect(() => {
		if (hangarLocation === 'popup') {
			setHideOwnHangar(true);
		} else if (hangarLocation === 'upload') {
			setHideOwnHangar(false);
		} else if (hangarLocation === 'profile') {
			setHideOwnHangar(false);
		} else if (hangarLocation === 'user') {
			setHideOwnHangar(true);
		}
	}, [hangarLocation]);

	return [hideOwnHangar, setHideOwnHangar];
};

/**
 * Handles returning a users personal builds hangar
 * @param {obj} initialState
 * @param {bool} sidebar - if the hangar is on the sidebar
 * @returns [personalBuildsHangar, setPersonalBuildsHangar]
 */
export const useSetPersonalBuildsHangar = (initialState, sidebar) => {
	const [personalBuildsHangar, setPersonalBuildsHangar] = useState(initialState);
	const { hangarLocation } = useHangarContext();
	const { user, authLoading, isAuthenticated, openProfile, fetchingProfile } = useAuthContext();

	useEffect(() => {
		if (sidebar) {
			if (isAuthenticated) {
				setPersonalBuildsHangar(prevState => {
					return {
						...prevState,
						builds: user.builds,
					};
				});
			}
		} else {
			if (hangarLocation !== 'user') {
				if (!authLoading && isAuthenticated) {
					setPersonalBuildsHangar(prevState => {
						return {
							...prevState,
							id: 'your-builds',
							hangarName: 'Your Builds',
							urlName: '',
							builds: user.builds,
						};
					});
				}
			} else if (hangarLocation === 'user') {
				if (!fetchingProfile && openProfile) {
					setPersonalBuildsHangar(prevState => {
						return {
							...prevState,
							builds: openProfile.builds,
							hangarName: `${openProfile.username}'s Builds`,
							id: `${buildNameToUrl(openProfile.username)}s-builds`,
							urlName: `${buildNameToUrl(openProfile.username)}s-builds`,
						};
					});
				}
			}
		}
	}, [authLoading, hangarLocation, isAuthenticated, fetchingProfile, openProfile]);

	return [personalBuildsHangar, setPersonalBuildsHangar];
};

/**
 * Handles setting a builds pinned hangar. uses the current loaded build.
 */
export const useSetPinnedHangar = pinnedHangar => {
	const { loadingBuild, loadedBuild } = useBuildContext();
	const { dispatchHangars } = useHangarContext();

	useEffect(() => {
		if (loadingBuild) return;
		setPinnedHangar(dispatchHangars, pinnedHangar ? pinnedHangar : loadedBuild?.pinnedHangar);
	}, [loadingBuild, loadedBuild, dispatchHangars, pinnedHangar]);
};

/**
 * Handles fetching a pinned hangar and all of its builds.
 * @param {*} initialState - [fetchedHangar, setFetchedHangar]
 * @returns
 */
export const useFetchPinnedHangar = initialState => {
	const [fetchedHangar, setFetchedHangar] = useState(initialState);
	const { loadingBuild, loadedBuild } = useBuildContext();
	const { dispatchHangars } = useHangarContext();
	const { dispatchAuth } = useAuthContext();
	const { fetchUsersProfile, checkIfUserInContext } = useFetchUser();
	const { fetchBuildsById } = useBuilds();

	useEffect(() => {
		if (loadingBuild) return;
		if (loadedBuild.pinnedHangar) {
			// If the current opened build has a pinned hangar, Get the profile of the builds author
			// Then get this pinned hangar from their list of hangars
			// Loop over that hangar and fetch all of the builds in that hangar
			let foundProfile = checkIfUserInContext(loadedBuild.uid);
			if (foundProfile) {
				const foundHangar = foundProfile.hangars.filter(hangar => loadedBuild.pinnedHangar === hangar.id);
				if (foundHangar.length > 0) {
					fetchBuildsById(foundHangar[0].builds, null, 'public');
					setFetchedHangar(foundHangar[0]);
					setFetchedPinnedHangar(dispatchHangars, foundHangar[0]);
					setFetchingProfile(dispatchAuth, false);
				} else {
					errorReport('Couldnt find hangar from user in context', false, 'useFetchPinnedHangar');
				}
			} else {
				setFetchingProfile(dispatchAuth, true);
				fetchUsersProfile(loadedBuild.uid)
					.then(fetchedUser => {
						const foundHangar = fetchedUser.hangars.filter(hangar => loadedBuild.pinnedHangar === hangar.id);
						if (foundHangar.length > 0) {
							setFetchedHangar(foundHangar[0]);
							setFetchedPinnedHangar(dispatchHangars, foundHangar[0]);
							fetchBuildsById(foundHangar[0].builds, null, 'public');
							setFetchingProfile(dispatchAuth, false);
						} else {
							throw new Error("Couldn't find hangar from server");
						}
					})
					.catch(error => {
						errorReport(error.message, true, 'useFetchPinnedHangar');
						setFetchingProfile(dispatchAuth, false);
					});
			}
		}
	}, [loadedBuild, loadingBuild]);

	return [fetchedHangar, setFetchedHangar];
};

/**
 * handles setting the ID of the build we want to add to a hangar in context
 * @param {string} buildId - id of the build to add
 */
export const useSetBuildToAddToHangar = buildId => {
	const { dispatchHangars } = useHangarContext();

	useEffect(() => {
		dispatchHangars({
			type: 'SET_HANGARS',
			payload: { buildToAddToHangar: buildId },
		});

		/*	
		let hangars = [];

		user?.hangars?.map(hanger => {
			if (checkIfBuildInHangar(buildId, hanger.id, user)) {
				hangars.push(hanger);
			}
		});

		dispatchHangars({
			type: 'SET_HANGARS',
			payload: { selectedHangars: hangars },
		});
		*/
	}, []);
};

/**
 * handles setting the start time for a long click on a hangar (like for editing its name)
 * @param {obj} newSelectedHanger - the selected hangar
 */
export const useSetSelectedHangars = newSelectedHanger => {
	const { dispatchHangars, selectedHangars, buildToAddToHangar } = useHangarContext();

	useEffect(() => {
		if (!newSelectedHanger) {
			dispatchHangars({
				type: 'SET_HANGARS',
				payload: { selectedHangars: [] },
			});

			return;
		}
		let newSelectedHangars = cloneDeep(selectedHangars);
		const hangarIndex = selectedHangars.findIndex(hangar => hangar.id === newSelectedHanger.id);

		// If we've already selected the hangar, remove it
		if (hangarIndex >= 0) {
			newSelectedHangars.splice(hangarIndex, 1);
		} else {
			if (buildToAddToHangar) {
				newSelectedHangars.push(newSelectedHanger);
			} else {
				newSelectedHangars = [newSelectedHanger];
			}
		}

		dispatchHangars({
			type: 'SET_HANGARS',
			payload: { selectedHangars: newSelectedHangars },
		});
	}, [newSelectedHanger, buildToAddToHangar]);
};

/**
 * Handles setting the current hangar location
 * @param {*} location
 */
export const useSetHangarLocation = location => {
	const { dispatchHangars } = useHangarContext();

	useEffect(() => {
		setHangarLocation(dispatchHangars, location);
	}, [location]);
};

/**
 * Handles setting the current open users profile
 */
export const useSetOpenUsersHangars = () => {
	const { openProfile } = useAuthContext();
	const { dispatchHangars } = useHangarContext();

	// Fetches the users builds once we get their profile
	useEffect(() => {
		// Check if we found the users profile
		if (openProfile && openProfile.username) {
			setUsersHangars(dispatchHangars, openProfile.hangars ? openProfile.hangars : []);
		}
	}, [openProfile]);
};

/**
 * Checks the URL for a hangar id. If we have a hangar in the url, sets that as open hangar and fetches all of the builds.
 * If theres no hangar in the url, fetches the users own builds.
 * @param {*} usersId
 */
export const useCheckOpenProfileHangarAndFetchBuilds = usersId => {
	const { openProfile } = useAuthContext();
	const { dispatchHangars, hangarLocation } = useHangarContext();
	const hangarId = useParams().hangarId;
	const navigate = useNavigate();
	const { fetchBuildsById } = useBuilds();
	const { user, isAuthenticated } = useAuthContext();

	// Fetches the users builds once we get their profile
	useEffect(() => {
		// Check if we found the users profile
		if (openProfile && openProfile.username && usersId) {
			if (hangarId) {
				const hangarToFetchId = openProfile.hangars?.filter(hangar => hangar.id === hangarId);

				if (hangarToFetchId && hangarToFetchId.length > 0) {
					setOpenedHangar(dispatchHangars, hangarToFetchId[0]);
				} else {
					const hangarToFetchName = openProfile.hangars?.filter(hangar => hangar.urlName === hangarId);

					if (hangarToFetchName && hangarToFetchName.length > 0) {
						setOpenedHangar(dispatchHangars, hangarToFetchName[0]);
					} else {
						navigate(`/user/${usersId}`);
						fetchBuildsById(openProfile.builds, openProfile.uid, 'user');
					}
				}
			} else {
				fetchBuildsById(openProfile.builds, openProfile.uid, 'user');
			}
		} else {
			if (hangarId && isAuthenticated) {
				// First check if we are getting the hanger by id
				const hangarToFetchId = user.hangars?.filter(hangar => hangar.id === hangarId);

				if (hangarToFetchId && hangarToFetchId.length > 0) {
					setOpenedHangar(dispatchHangars, hangarToFetchId[0]);
				} else {
					// if not id, check by name
					const hangarToFetchByName = user.hangars?.filter(hangar => hangar.urlName === hangarId);

					if (hangarToFetchByName && hangarToFetchByName.length > 0) {
						setOpenedHangar(dispatchHangars, hangarToFetchByName[0]);
					} else {
						navigate(`/profile`);
						fetchBuildsById(user.builds, user.uid, 'user');
					}
				}
			} else if (isAuthenticated) {
				fetchBuildsById(user.builds, user.uid, 'user');
			}
		}
	}, [openProfile]);
};

export default useAddNewHangar;

// State Managers---------------------------------------------------------------------------------------------------//
/**
 * handles setting the currently open hangar.
 * @param {obj} hangar - the currently open hangar
 */
export const setOpenedHangar = async (dispatchHangars, hangar) => {
	dispatchHangars({
		type: 'SET_HANGARS',
		payload: { openedHangar: hangar },
	});
};

/**
 * handles setting the time when a hangar was clicked
 * @param {function} dispatchHangars - dispatch function
 * @param {string} time - takes in a new Date() time
 */
export const setLastClickTime = (dispatchHangars, time) => {
	dispatchHangars({
		type: 'SET_HANGARS',
		payload: { lastClickTime: time },
	});
};

/**
 * handles setting the hangar to edit
 * @param {function} dispatchHangars - dispatch function
 * @param {obj} hangar - the hangar to edit
 */
export const setEditingHangar = (dispatchHangars, hangar) => {
	dispatchHangars({
		type: 'SET_HANGARS',
		payload: { editingHangar: hangar },
	});
};

/**
 * handles setting the name of the hangar being edited
 * @param {function} dispatchHangars - dispatch function
 * @param {string} hangarName - the name of the hangar being edited
 */
export const setEditingHangarName = (dispatchHangars, hangarName) => {
	dispatchHangars({
		type: 'SET_HANGARS',
		payload: { editingHangarName: hangarName },
	});
};

/**
 * handles setting the start time for a long click on a hangar (like for editing its name)
 * @param {function} dispatchHangars - dispatch function
 * @param {string} time - takes in a new Date() time
 */
export const setLongClickStart = (dispatchHangars, time) => {
	dispatchHangars({
		type: 'SET_HANGARS',
		payload: { longClickStart: time },
	});
};

/**
 * handles setting the view for viewing list of hangars
 * @param {function} dispatchHangars - dispatch function
 * @param {string} option - Grid / List
 */
export const setHangarView = (dispatchHangars, option) => {
	localStorage.setItem('hangarView', option);
	dispatchHangars({
		type: 'SET_HANGARS',
		payload: { hangarView: option },
	});
};

/**
 * handles setting the id of the hangar to delete
 * @param {function} dispatchHangars - dispatch function
 * @param {string} hangarID - id of hangar to delete
 * @param {string} deleteHangarName - name of hangar to delete
 */
export const setDeleteHangar = (dispatchHangars, hangarID, deleteHangarName) => {
	dispatchHangars({
		type: 'SET_HANGARS',
		payload: { deleteHangarId: hangarID, deleteHangarName },
	});
};

/**
 * handles setting the start time for a long click on a hangar (like for editing its name)
 * @param {function} dispatchHangars - dispatch function
 * @param {obj} selectedHangar - the selected hangar
 * @param {arr} selectedHangars - All of the currently selected hangars
 * @param {string} buildToAddToHangar - a build to add to hangar
 */
export const setSelectedHangar = (dispatchHangars, selectedHangar, selectedHangars, buildToAddToHangar) => {
	if (!selectedHangar) {
		dispatchHangars({
			type: 'SET_HANGARS',
			payload: { selectedHangars: [] },
		});

		return;
	}

	let newSelectedHangars = cloneDeep(selectedHangars);
	const hangarIndex = selectedHangars.findIndex(hangar => hangar.id === selectedHangar.id);

	// If we've already selected the hangar, remove it
	if (hangarIndex >= 0) {
		newSelectedHangars.splice(hangarIndex, 1);
	} else {
		if (buildToAddToHangar) {
			newSelectedHangars.push(selectedHangar);
		} else {
			newSelectedHangars = [selectedHangar];
		}
	}

	dispatchHangars({
		type: 'SET_HANGARS',
		payload: { selectedHangars: newSelectedHangars },
	});
};

/**
 * handles setting if the user is making a new hangar
 * @param {function} dispatchHangars - dispatch function
 * @param {bool} bool - true or false
 */
export const setMakingNewHangar = (dispatchHangars, bool) => {
	dispatchHangars({
		type: 'SET_HANGARS',
		payload: { makingNewHangar: bool },
	});
};

/**
 * Handles setting the new hangar name in context
 * @param {function} dispatchHangars - dispatch function
 * @param {string} hangarName - New hangar name
 */
export const setNewHangarName = (dispatchHangars, hangarName) => {
	dispatchHangars({
		type: 'SET_HANGARS',
		payload: { newHangarName: hangarName },
	});
};

/**
 * handles setting the ID of the build we want to add to a hangar in context
 * @param {function} dispatchHangars - dispatch function
 * @param {string} buildId - id of the build to add
 * @param {obj} user - the current logged in user
 */
export const setBuildToAddToHangar = (dispatchHangars, buildId, user) => {
	dispatchHangars({
		type: 'SET_HANGARS',
		payload: { buildToAddToHangar: buildId },
	});

	let hangars = [];

	user?.hangars?.map(hangar => {
		if (checkIfBuildInHangar(buildId, hangar.id, user)) {
			hangars.push(hangar);
		}
	});

	dispatchHangars({
		type: 'SET_HANGARS',
		payload: { selectedHangars: hangars },
	});
};

/**
 * Handles setting if the Modal for adding a build to a hangar is open or not
 * @param {function} dispatchHangars - dispatch function
 * @param {bool} bool - true or false
 */
export const setAddBuildToHangarModal = (dispatchHangars, bool) => {
	dispatchHangars({
		type: 'SET_HANGARS',
		payload: { addToHangarModalOpen: bool },
	});
};

/**
 * Handles setting the last selected hangar ID in the context
 * @param {function} dispatchHangars - dispatch function
 * @param {bool} hangarId - id of the hangar to select
 */
export const setLastSelectedHangar = (dispatchHangars, hangarId) => {
	dispatchHangars({
		type: 'SET_HANGARS',
		payload: { lastSelectedHangarId: hangarId },
	});
};

/**
 * handles setting where the hangar is currently open
 * @param {function} dispatchHangars - dispatch function
 * @param {string} location - where the hangar is currently open (user, popup, profile, upload)
 */
export const setHangarLocation = (dispatchHangars, location) => {
	dispatchHangars({
		type: 'SET_HANGARS',
		payload: { hangarLocation: location },
	});
};

/**
 * handles setting where the hangar is currently open
 * @param {function} dispatchHangars - dispatch function
 * @param {arr} hangars - a array of users hangars to display
 */
export const setUsersHangars = (dispatchHangars, hangars) => {
	dispatchHangars({
		type: 'SET_HANGARS',
		payload: { usersHangars: hangars },
	});
};

/**
 * handles setting if the hangar view is collapsed or not
 * @param {function} dispatchHangars - dispatch function
 * @param {arr} bool
 */
export const setCollapsedHangars = (dispatchHangars, bool) => {
	dispatchHangars({
		type: 'SET_HANGARS',
		payload: { collapsedHangars: bool },
	});
};

/**
 * Handles setting the id of the hangar to pin on a build
 * @param {function} dispatchHangars - dispatch function
 * @param {string} hangarId
 */
export const setPinnedHangar = (dispatchHangars, hangarId) => {
	dispatchHangars({
		type: 'setPinnedHangar',
		payload: hangarId,
	});
};

/**
 * Handles setting the id of the hangar to pin on a build
 * @param {function} dispatchHangars - dispatch function
 * @param {string} hangar - the fetched hangar
 */
export const setFetchedPinnedHangar = (dispatchHangars, hangar) => {
	dispatchHangars({
		type: 'SET_HANGARS',
		payload: { fetchedPinnedHangar: hangar },
	});
};

/**
 * Handles setting the user of the hangar we are currently openign
 * @param {function} dispatchHangars - dispatch function
 * @param {string} user - the fetched user whose hangars we want
 */
export const setCurrentHangarOwner = (dispatchHangars, user) => {
	dispatchHangars({
		type: 'SET_HANGARS',
		payload: { currentHangarOwner: user },
	});
};

/**
 * Handles setting if we are currently saving something to a hangar or not
 * @param {function} dispatchHangars - dispatch function
 * @param {bool} savingToHangar
 */
export const setSavingToHangar = (dispatchHangars, savingToHangar) => {
	dispatchHangars({
		type: 'SET_HANGARS',
		payload: { savingToHangar: savingToHangar },
	});
};

/**
 * Handles setting if we are displaying the hangar limit modal or not
 * @param {function} dispatchHangars - dispatch function
 * @param {bool} value - true or false
 */
export const setHangarLimitModal = (dispatchHangars, value) => {
	dispatchHangars({
		type: 'SET_HANGARS',
		payload: { hangarLimitModal: value },
	});
};
