import React, { useState, useEffect } from 'react';
import { BsCaretDownSquareFill } from 'react-icons/bs';

function SectionContainer({ children, css, sectionName }) {
	const [collapse, setCollapse] = useState(false);

	useEffect(() => {
		let value = localStorage.getItem(sectionName + '-collapse');
		setCollapse(value);
	}, []);

	const handleCollapse = () => {
		setCollapse(!collapse);
		localStorage.setItem(sectionName + '-collapse', !collapse);
	};

	return (
		<div className={`${css ? css : ''} relative w-full rounded-xl text-white bg-base-900 flex flex-row p-4 2k:p-8`}>
			<div className={`absolute top-4 right-4 text-3xl cursor-pointer text-slate-300 transition-all ${collapse ? 'rotate-180' : ''}`} onClick={handleCollapse}>
				<BsCaretDownSquareFill />
			</div>

			{!collapse ? <>{children} </> : <div className="text-2xl 2k:text-3xl text-slate-200 font-bold">{sectionName}</div>}
		</div>
	);
}

export default SectionContainer;
