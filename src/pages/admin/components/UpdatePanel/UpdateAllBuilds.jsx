import React from 'react';
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';
import { db } from '../../../../firebase.config';
import { toast } from 'react-toastify';
import Button from '../../../../components/buttons/Button';

function UpdateAllBuilds() {
	/**
	 * Handles updating every build
	 */
	const updateAllBuilds = async () => {
		try {
			const buildsRef = collection(db, 'builds');
			const buildsSnap = await getDocs(buildsRef);

			buildsSnap.forEach(buildDoc => {
				const buildRef = doc(db, 'builds', buildDoc.id);
				const build = buildDoc.data();

				const updateBuild = async () => {
					try {
						const updateBuild = async () => {
							try {
								await updateDoc(buildRef, { type: 'build' });
							} catch (error) {
								console.log(error);
							}
						};

						await updateBuild();
					} catch (error) {
						throw new Error(error);
					}
				};

				updateBuild();
			});

			toast.success('All Builds updated!');
		} catch (error) {
			console.log(error);
		}
	};

	//---------------------------------------------------------------------------------------------------//
	return (
		<div className="flex flex-row items-center gap-4">
			<p className="text-2xl 2k:text-3xl text-slate-200 font-bold">Upate all Builds</p>
			<Button color="btn-primary" text="Update" onClick={updateAllBuilds} />
		</div>
	);
}

export default UpdateAllBuilds;
