import React, { useContext, useState, useEffect } from 'react';
import BuildContext from '../../../context/build/BuildContext';
import { setBuildToUpload } from '../../../context/build/BuildActions';
import fetchBuildFromAWS from '../../../utilities/fetchBuildFromAws';
import { toast } from 'react-toastify';

/**
 * Input the field for the builds name
 * @returns
 */
function UploadBuildRawBuild() {
	const { dispatchBuild, buildToUpload, editingBuild } = useContext(BuildContext);
	const [loadingRawBuild, setLoadingRawBuild] = useState(true);

	useEffect(() => {
		if (editingBuild) {
			setLoadingRawBuild(true);

			const fetchRawBuild = async () => {
				try {
					const fetchedRawBuild = await fetchBuildFromAWS(editingBuild.id);
					return fetchedRawBuild;
				} catch (error) {
					console.log(error);
					toast.error('Something went wrong fetching the Raw build');
				}
			};

			fetchRawBuild().then(fetchedRawBuild => {
				setBuildToUpload(dispatchBuild, { ...buildToUpload, build: fetchedRawBuild });
				setLoadingRawBuild(false);
			});
		}
	}, [editingBuild]);

	//---------------------------------------------------------------------------------------------------//
	if (buildToUpload) {
		return (
			<>
				<div className="flex flex-row items-center gap-4 mb-2 2k:mb-4 mt-10 2k:mt-18">
					<h3 className="text-slate-200 text-xl 2k:text-3xl">Paste build here</h3>
					<label className="btn 2k:btn-lg 2k:text-2xl text-slate-400 bg-base-900" htmlFor="how-to-copy-build-modal">
						How?
					</label>
				</div>

				{editingBuild ? (
					<>
						{!loadingRawBuild ? (
							<textarea
								id="build"
								onChange={e => setBuildToUpload(dispatchBuild, { ...buildToUpload, build: e.target.value })}
								defaultValue={buildToUpload.build}
								className="textarea textarea-bordered 2k:text-2xl mb-6 w-full"
								placeholder="Paste..."
								rows="4"
							></textarea>
						) : null}
					</>
				) : (
					<textarea
						id="build"
						onChange={e => setBuildToUpload(dispatchBuild, { ...buildToUpload, build: e.target.value })}
						defaultValue={''}
						className="textarea textarea-bordered 2k:text-2xl mb-6 w-full"
						placeholder="Paste..."
						rows="4"
					></textarea>
				)}
			</>
		);
	}
}

export default UploadBuildRawBuild;
