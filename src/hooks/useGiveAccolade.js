import { toast } from 'react-toastify';
import errorReport from '../utilities/errorReport';
import { sendNotification, updateUserProfilesAndDb } from '../context/auth/AuthUtils';
import standardNotifications from '../utilities/standardNotifications';
import { cloneDeep } from 'lodash';
import { useAuthContext } from '../context/auth/AuthContext';
import { addDoc, collection, doc, getDocs, increment, updateDoc } from 'firebase/firestore';
import { db } from '../firebase.config';

/**
 * hook for giving a user an accolade
 * @returns - giveAccoladeToAllUsersAndNotify function
 */
export const useGiveAccolade = () => {
	const { user } = useAuthContext();

	/**
	 * handles giving the accolade to a user and notifying them
	 * @param {*} accolade - the accolade to give
	 * @param {*} setGiveAccolade - the setter state for the modal to be visible
	 */
	const giveAccoladeToAllUsersAndNotify = async (accolade, setGiveAccolade) => {
		try {
			let newAccolade = {};
			newAccolade.id = accolade.id;
			newAccolade.dateReceived = new Date();

			// Give Accolade ------------------------------------------------------------------------
			const usersRef = collection(db, 'testUsers');
			const usersSnap = await getDocs(usersRef);

			usersSnap.forEach(fetchedUser => {
				const userData = fetchedUser.data();
				userData.id = fetchedUser.id;

				if (userData.accolades) {
					userData.accolades.push(newAccolade);
				} else {
					userData.accolades = [newAccolade];
				}

				updateDoc(doc(db, 'testUsers', userData.id), { accolades: userData.accolades, rocketReputation: increment(accolade.points) });
				updateDoc(doc(db, 'testUserProfiles', userData.id), { accolades: userData.accolades, rocketReputation: increment(accolade.points) });

				// Notification ------------------------------------------------------------------------
				const newNotif = cloneDeep(standardNotifications);
				newNotif.type = 'accolade';
				newNotif.message = `{\"blocks\":[{\"key\":\"5mft5\",\"text\":\"${accolade.name}\",\"type\":\"unstyled\",\"depth\":0,\"inlineStyleRanges\":[{\"offset\":0,\"length\":${accolade.name.length},\"style\":\"BOLD\"},{\"offset\":0,\"length\":${accolade.name.length},\"style\":\"fontsize-16\"}],\"entityRanges\":[],\"data\":{}}],\"entityMap\":{}}`;
				newNotif.uid = user.uid;
				newNotif.username = user.username;
				newNotif.profilePicture = user.profilePicture;
				newNotif.timestamp = new Date();
				newNotif.image = accolade.iconLg;
				delete newNotif.buildId;
				delete newNotif.buildName;
				delete newNotif.comment;
				delete newNotif.commentId;

				const userRef = collection(db, 'testUsers', userData.id, 'notifications');
				addDoc(userRef, newNotif);

				// sendNotification(userData.id, newNotif);
			});

			toast.success('Accolades awarded!');
			setGiveAccolade(false);
		} catch (error) {
			errorReport(error, false, 'selectedAccolade');
			toast.error('Something went wrong giving accolade');
		}
	};

	return { giveAccoladeToAllUsersAndNotify };
};

/**
 * handles giving the accolade to a user and notifying them
 * @param {func} dispatchAuth - Auth dispatch
 * @param {arr} accolades - the accolades to give.
 * @param {obj} userToGive - user to give the accolade to
 * @param {func} setGiveAccolade - (optional) the setter state for the modal to be visible
 */
export const giveAccoladeAndNotify = async (dispatchAuth, accolades, userToGive, setGiveAccolade) => {
	try {
		if (accolades?.length === 0) {
			console.log(`No accolades to give`);
			return;
		}
		accolades.map(accolade => {
			let newAccolade = {};
			newAccolade.id = accolade.id;
			newAccolade.dateReceived = new Date();

			// Give Accolade ------------------------------------------------------------------------
			userToGive.accolades.push(newAccolade);
			updateUserProfilesAndDb(dispatchAuth, { accolades: userToGive.accolades, rocketReputation: increment(accolade.points) }, userToGive);

			// Notification ------------------------------------------------------------------------
			const newNotif = cloneDeep(standardNotifications);
			newNotif.type = 'accolade';
			newNotif.message = `{\"blocks\":[{\"key\":\"5mft5\",\"text\":\"${accolade.name}\",\"type\":\"unstyled\",\"depth\":0,\"inlineStyleRanges\":[{\"offset\":0,\"length\":${accolade.name.length},\"style\":\"BOLD\"},{\"offset\":0,\"length\":${accolade.name.length},\"style\":\"fontsize-16\"}],\"entityRanges\":[],\"data\":{}}],\"entityMap\":{}}`;
			newNotif.uid = 'ZyVrojY9BZU5ixp09LftOd240LH3';
			newNotif.username = 'nyius';
			newNotif.profilePicture = 'https://firebasestorage.googleapis.com/v0/b/kspbuilds.appspot.com/o/images%2FZyVrojY9BZU5ixp09LftOd240LH3-selfie.png-9d4dfce8-3c29-41b1-8e64-4c4a3ec4c440?alt=media&token=5825b603-893c-4471-accc-65ada96b06f9';
			newNotif.timestamp = new Date();
			newNotif.image = accolade.iconLg;
			delete newNotif.buildId;
			delete newNotif.buildName;
			delete newNotif.comment;
			delete newNotif.commentId;

			sendNotification(userToGive.uid, newNotif);
		});

		toast.success('Accolade awarded!');
		if (setGiveAccolade) setGiveAccolade(false);
	} catch (error) {
		errorReport(error, false, 'selectedAccolade');
		toast.error('Something went wrong giving accolade');
	}
};
