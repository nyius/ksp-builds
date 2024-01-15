import React from 'react';

function ColorPalette() {
	return (
		<>
			<div className="text-2xl 2k:text-3xl text-slate-200 font-bold">Website Colors</div>
			<div className="flex flex-row gap-2 flex-wrap w-full">
				<div className="w-32 h-32 rounded-lg border-1 border-solid border-slate-700 bg-primary"></div>
				<div className="w-32 h-32 rounded-lg border-1 border-solid border-slate-700 bg-secondary"></div>
				<div className="w-32 h-32 rounded-lg border-1 border-solid border-slate-700 bg-accent"></div>
				<div className="w-32 h-32 rounded-lg border-1 border-solid border-slate-700 bg-error"></div>
				<div className="w-32 h-32 rounded-lg border-1 border-solid border-slate-700 bg-success"></div>
				<div className="w-32 h-32 rounded-lg border-1 border-solid border-slate-700 bg-base-100"></div>
				<div className="w-32 h-32 rounded-lg border-1 border-solid border-slate-700 bg-base-200"></div>
				<div className="w-32 h-32 rounded-lg border-1 border-solid border-slate-700 bg-base-300"></div>
				<div className="w-32 h-32 rounded-lg border-1 border-solid border-slate-700 bg-base-400"></div>
				<div className="w-32 h-32 rounded-lg border-1 border-solid border-slate-700 bg-base-500"></div>
				<div className="w-32 h-32 rounded-lg border-1 border-solid border-slate-700 bg-base-600"></div>
				<div className="w-32 h-32 rounded-lg border-1 border-solid border-slate-700 bg-base-700"></div>
				<div className="w-32 h-32 rounded-lg border-1 border-solid border-slate-700 bg-base-800"></div>
				<div className="w-32 h-32 rounded-lg border-1 border-solid border-slate-700 bg-base-900"></div>
			</div>
		</>
	);
}

export default ColorPalette;
