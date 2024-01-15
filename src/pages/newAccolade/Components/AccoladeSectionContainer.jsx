import React, { useState, useEffect } from 'react';
import { BsCaretDownSquareFill } from 'react-icons/bs';

/**
 * section container for the accolades dashboard
 * @param {*} title - the section title
 * @param {*} children
 * @returns
 */
function AccoladeSectionContainer({ children, title }) {
	const [hidden, setHidden] = useState(false);

	useEffect(() => {
		let value = JSON.parse(localStorage.getItem(title + '-collapse'));
		setHidden(value);
	}, []);

	const handleCollapse = () => {
		setHidden(!hidden);
		localStorage.setItem(title + '-collapse', !hidden);
	};

	return (
		<div className="bg-base-600 rounded-xl">
			<div className="relative text-2xl 2k:text-3xl text-slate-200 bg-primary px-10 2k:px-20 py-5 2k:py-7 rounded-t-xl font-black w-full cursor-pointer" onClick={handleCollapse}>
				{title}
				<div className={`absolute top-4 right-4 text-3xl cursor-pointer text-slate-300 transition-all ${hidden ? 'rotate-180' : ''}`} onClick={handleCollapse}>
					<BsCaretDownSquareFill />
				</div>
			</div>
			{hidden ? '' : <div className="flex flex-col gap-10 2k:gap-20 w-full p-10 2k:p-20">{children}</div>}
		</div>
	);
}

export default AccoladeSectionContainer;
