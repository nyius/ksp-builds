import React from 'react';
import { toast } from 'react-toastify';
import { updateMetadata, ref, listAll } from 'firebase/storage';
import Button from '../../../../components/buttons/Button';
import { storage } from '../../../../firebase.config';

function UpdateAllAmazonS3StorageItems() {
	/**
	 * Updates all image items on firebase storage
	 */
	const updateAllStorageItems = async () => {
		try {
			const imagesRef = ref(storage, 'images');

			const newMetadata = {
				cacheControl: 'public,max-age=31536000',
			};

			listAll(imagesRef)
				.then(res => {
					res.items.forEach(image => {
						const imageRef = ref(storage, image._location.path);

						updateMetadata(imageRef, newMetadata)
							.then(metadata => {
								// Updated metadata for 'images/forest.jpg' is returned in the Promise
								console.log(metadata);
							})
							.catch(error => {
								throw new Error(error);
							});
					});
				})
				.catch(err => {
					throw new Error(err);
				});

			toast.success('Storage items updated');
		} catch (error) {
			console.log(error);
			toast.error('Something went wrong');
		}
	};

	return (
		<div className="flex flex-col gap-4 place-content-between">
			<p className="text-2xl 2k:text-4xl text-slate-200 font-bold">Update all storage items</p>
			<Button color="btn-primary" text="Update" onClick={updateAllStorageItems} />
		</div>
	);
}

export default UpdateAllAmazonS3StorageItems;
