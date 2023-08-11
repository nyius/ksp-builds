import { db } from '../../firebase.config';
import { collection, getDocs } from 'firebase/firestore';
import { toast } from 'react-toastify';
import errorReport from '../../utilities/errorReport';

/**
 * Handles fetching patch notes
 * @returns
 */
export const fetchPatchNotes = async () => {
	try {
		let data = [];

		const patchSnap = await getDocs(collection(db, 'patchNotes'));

		patchSnap.forEach(note => {
			const noteData = note.data();
			noteData.id = note.id;
			data.push(noteData);
		});

		const sortedPatchNotes = data.sort((a, b) => {
			let aDate = a.timestamp.seconds;
			let bDate = b.timestamp.seconds;

			return aDate < bDate ? 1 : -1;
		});

		return sortedPatchNotes;
	} catch (error) {
		errorReport(error.message, true, 'fetchPatchNotes');
		toast.error("Couldn't fetch patch notes");
	}
};
