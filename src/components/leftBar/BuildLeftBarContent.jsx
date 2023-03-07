import React, { useContext, useEffect, useState } from 'react';
import BuildContext from '../../context/build/BuildContext';
import Spinner1 from '../spinners/Spinner1';
import LeftBarTitle from './LeftBarTitle';

function BuildLeftBarContent() {
	const { loadingBuild, loadedBuild } = useContext(BuildContext);
	const [date, setDate] = useState(null);

	useEffect(() => {
		if (loadedBuild) {
			setDate(new Intl.DateTimeFormat('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' }).format(loadedBuild?.timestamp.seconds * 1000));
		}
	}, [loadedBuild]);

	if (loadingBuild) {
		return <Spinner1 />;
	} else {
	}
	return (
		<div className="flex flex-col gap-2 2k:gap-6">
			<LeftBarTitle text="Details" />
			{/* Author */}
			<div className="flex flex-row gap-2 items-center place-content-between text-lg 2k:text-3xl">
				Author <span className="badge 2k:badge-lg 2k:text-3xl p-3 2k:p-5">{loadedBuild.author}</span>
			</div>

			{/* Date */}
			<div className="flex flex-row gap-2 items-center place-content-between text-lg 2k:text-3xl">
				Uploaded <span className="badge 2k:badge-lg 2k:text-3xl p-3 2k:p-5">{date}</span>
			</div>

			{/* Version */}
			<div className="flex flex-row gap-2 items-center place-content-between text-lg 2k:text-3xl">
				KSP Version <span className="badge 2k:badge-lg 2k:text-3xl p-3 2k:p-5">{loadedBuild.kspVersion}</span>
			</div>

			{/* Mods */}
			<div className="flex flex-row gap-2 items-center place-content-between text-lg 2k:text-3xl">
				Has Mods <span className="badge 2k:badge-lg 2k:text-3xl p-3 2k:p-5">{loadedBuild.modsUsed ? 'Yes' : 'None'}</span>
			</div>
		</div>
	);
}

export default BuildLeftBarContent;
