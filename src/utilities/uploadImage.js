import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { storage } from '../firebase.config';
import { toast } from 'react-toastify';
import { v4 as uuidv4 } from 'uuid';
import { auth } from '../firebase.config';
import { compressAccurately } from 'image-conversion';
import errorReport from './errorReport';

/**
 * Handles uploading an Image. takes in the image file, a setLoadingState, a users uid. Returns new URL.
 * @param {*} image
 * @param {*} setLoadingState
 * @param {*} uid
 */
export const uploadImage = async (image, setLoadingState, uid) => {
	setLoadingState(true);

	return new Promise((resolve, reject) => {
		const fileName = `${uid}-${uuidv4().slice(0, 10)}`;

		const storageRef = ref(storage, 'images/' + fileName);
		const uploadTask = uploadBytesResumable(storageRef, image, { cacheControl: 'public,max-age=31536000' });

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
				errorReport(`${error.message}; code:${error.code}`, true, 'uploadImage');
				// A full list of error codes is available at
				// https://firebase.google.com/docs/storage/web/handle-errors
				switch (error.code) {
					case 'storage/unauthorized':
						toast.error(`You don't have permission to do that`);
						setLoadingState(false);
						reject(error);
						break;
					case 'storage/canceled':
						toast.error('Upload cancelled');
						setLoadingState(false);
						reject(error);
						break;
					case 'storage/unknown':
						toast.error(`Upload failed. Please try again`);
						setLoadingState(false);
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

/**
 * handles uploading multiple images to the DB.
 * @param {file} images - images to upload
 * @param {function} setLoadingState - a setter state for loading
 * @param {int} imageKb - (optional) - the target KB size for each image
 * @param {int} imageWidth - (optional) - the target width for each image
 * @returns
 */
export const uploadImages = async (images, setLoadingState, imageKb, imageWidth) => {
	setLoadingState(true);

	for (const image in images) {
		if (images[image].size > 5242880) {
			toast.error(`${images[image].name} is too big! Must be smaller than 5mb`);
			setLoadingState(false);
			return;
		}
	}

	/**
	 * Stores the image on firebase
	 * @param {*} image
	 * @returns
	 */
	const storeImage = async image => {
		// Store images in firebase
		return new Promise((resolve, reject) => {
			const fileName = `${auth.currentUser.uid}-${uuidv4()}`;

			const storageRef = ref(storage, 'images/' + fileName);
			const uploadTask = uploadBytesResumable(storageRef, image, { cacheControl: 'public,max-age=31536000' });

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

	/**
	 * Compress images to 400kb, 1300px width (if not set in upload images func).
	 * @returns
	 */
	const compressImg = async image => {
		try {
			return new Promise((resolve, reject) => {
				const compressImg = async image => {
					const compressed = await compressAccurately(image, {
						size: imageKb ? imageKb : 400,
						width: imageWidth ? imageWidth : 1300,
					});
					return compressed;
				};

				const compressesImage = compressImg(image);
				resolve(compressesImage);
			});
		} catch (error) {
			errorReport(error.message, true, 'compressImg');
		}
	};

	const compressedImages = await Promise.all([...images].map(img => compressImg(img)));

	const imgUrls = await Promise.all([...compressedImages].map(img => storeImage(img))).catch(() => {
		setLoadingState(false);
		toast.error('Images not uploaded');
		return;
	});

	setLoadingState(false);
	return imgUrls;
};
