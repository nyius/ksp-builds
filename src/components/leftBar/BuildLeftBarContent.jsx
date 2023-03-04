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
		<div className="flex flex-col gap-2">
			<LeftBarTitle text="Details" />
			{/* Author */}
			<div className="flex flex-row gap-2 items-center place-content-between text-lg">
				Author <span className="badge p-3">{loadedBuild.author}</span>
			</div>

			{/* Date */}
			<div className="flex flex-row gap-2 items-center place-content-between text-lg">
				Uploaded <span className="badge p-3">{date}</span>
			</div>

			{/* Version */}
			<div className="flex flex-row gap-2 items-center place-content-between text-lg">
				KSP Version <span className="badge p-3">{loadedBuild.kspVersion}</span>
			</div>

			{/* Mods */}
			<div className="flex flex-row gap-2 items-center place-content-between text-lg">
				Has Mods <span className="badge p-3">{loadedBuild.modsUsed ? 'Yes' : 'None'}</span>
			</div>
		</div>
	);
}

export default BuildLeftBarContent;
