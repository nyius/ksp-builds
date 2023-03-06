import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { storage } from '../firebase.config';
import { toast } from 'react-toastify';
import { v4 as uuidv4 } from 'uuid';
import { auth } from '../firebase.config';

/**
 * Handles uploading an Image. takes in the image file, a setLoadingState, a users uid, and a state to set the new image url to.
 * @param {*} image
 * @param {*} setLoadingState
 * @param {*} uid
 * @param {*} setImage
 */
export const uploadImage = async (image, setLoadingState, uid, setImage) => {
	setLoadingState(true);
	const fileName = `${uid}-${image.name}-${uuidv4()}`;

	const storageRef = ref(storage, 'images/' + fileName);
	const uploadTask = uploadBytesResumable(storageRef, image);

	// Listen for state changes, errors, and completion of the upload.
	uploadTask.on(
		'state_changed',
		snapshot => {
			// Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
			const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
			console.log('Upload is ' + progress + '% done');
			switch (snapshot.state) {
				case 'paused':
					console.log('Upload is paused');
					break;
				case 'running':
					console.log('Upload is running');
					break;
			}
		},
		error => {
			console.log(error.code);
			// A full list of error codes is available at
			// https://firebase.google.com/docs/storage/web/handle-errors
			switch (error.code) {
				case 'storage/unauthorized':
					toast.error(`You don't have permission to do that`);
					setLoadingState(false);
					break;
				case 'storage/canceled':
					toast.error('Upload cancelled');
					setLoadingState(false);
					break;
				case 'storage/unknown':
					toast.error(`Upload failed. Please try again`);
					setLoadingState(false);
					break;
			}
		},
		() => {
			// Upload completed successfully, now we can get the download URL
			getDownloadURL(uploadTask.snapshot.ref).then(downloadURL => {
				setLoadingState(false);
				setImage(downloadURL);
				return downloadURL;
			});
		}
	);
};

/**
 * handles uploading multiple images to the DB.
 * @param {*} image
 * @returns
 */
export const uploadImages = async (images, setLoadingState) => {
	setLoadingState(true);

	const storeImage = async image => {
		// Store images in firebase
		return new Promise((resolve, reject) => {
			const fileName = `${auth.currentUser.uid}-${image.name}-${uuidv4()}`;

			const storageRef = ref(storage, 'images/' + fileName);
			const uploadTask = uploadBytesResumable(storageRef, image);

			// Listen for state changes, errors, and completion of the upload.
			uploadTask.on(
				'state_changed',
				snapshot => {
					// Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
					const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
					console.log('Upload is ' + progress + '% done');
					switch (snapshot.state) {
						case 'paused':
							console.log('Upload is paused');
							break;
						case 'running':
							console.log('Upload is running');
							break;
					}
				},
				error => {
					// A full list of error codes is available at
					// https://firebase.google.com/docs/storage/web/handle-errors
					switch (error.code) {
						case 'storage/unauthorized':
							toast.error(`You don't have permission to do that`);
							reject(error);
							break;
						case 'storage/canceled':
							toast.error('Upload cancelled');
							reject(error);
							break;
						case 'storage/unknown':
							toast.error(`Upload failed. Please try again`);
							reject(error);
							break;
					}
				},
				() => {
					// Upload completed successfully, now we can get the download URL
					getDownloadURL(uploadTask.snapshot.ref).then(downloadURL => {
						resolve(downloadURL);
					});
				}
			);
		});
	};

	const imgUrls = await Promise.all([...images].map(img => storeImage(img))).catch(() => {
		setLoadingState(false);
		toast.error('Images not uploaded');
		return;
	});

	setLoadingState(false);
	return imgUrls;
};
