import React, { useState, useEffect } from 'react';
import { BsCaretDownSquareFill } from 'react-icons/bs';

/**
 * Displays a section on the admin panel
 * @param {*} css
 * @param {*} sectionName
 * @returns
 */
function SectionContainer({ children, css, sectionName }) {
	const [collapse, setCollapse] = useState(false);

	useEffect(() => {
		let value = JSON.parse(localStorage.getItem(sectionName + '-collapse'));
		setCollapse(value);
	}, []);

	const handleCollapse = () => {
		setCollapse(!collapse);
		localStorage.setItem(sectionName + '-collapse', !collapse);
	};

	return (
		<div className={`${css ? css : ''} w-full rounded-xl text-white bg-base-900 flex flex-col`}>
			<div className="w-full relative bg-primary h-14 rounded-t-lg px-10 py-4 cursor-pointer" onClick={handleCollapse}>
				<div className="text-2xl 2k:text-3xl text-slate-200 font-bold">{sectionName}</div>
				<div className={`absolute top-4 right-4 text-3xl text-slate-300 transition-all ${collapse ? 'rotate-180' : ''}`}>
					<BsCaretDownSquareFill />
				</div>
			</div>

			{!collapse ? <div className="p-8 2k:p-12">{children}</div> : ''}
		</div>
	);
}

export default SectionContainer;
