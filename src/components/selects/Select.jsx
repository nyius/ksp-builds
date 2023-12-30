import React, { useState, useEffect, useRef } from 'react';
import Arrows from '../../assets/up-down-arrows.svg';

/**
 *
 * @param {*} text - The function to handle changing options
 * @returns
 */
function Select({ selectedOption, children, visibleState, visibleSetter, selectText, size }) {
	const divRef = useRef(null);

	// Listener for clicking outside of the dropdown
	useEffect(() => {
		// Attach the event listener when the component mounts
		document.addEventListener('mousedown', handleClickOutside);

		// Detach the event listener when the component unmounts
		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, []);

	/**
	 * Handles listening for a click outside of the dropdown and hides it.
	 * @param {*} event
	 */
	const handleClickOutside = event => {
		if (divRef.current && !divRef.current.contains(event.target)) {
			// Clicked outside of the div, set the state to false
			visibleSetter(false);
		}
	};

	return (
		<div className="relative">
			<div
				className={`rounded-xl ${size ? size : 'w-66'} bg-base-200 flex flex-row items-center hover:bg-base-300 place-content-between border-1 border-solid border-slate-700 text-xl 2k:text-2xl py-4 px-5 text-slate-200 cursor-pointer`}
				onClick={() => visibleSetter(!visibleState)}
			>
				<div className="unselectable">
					{selectText} {selectedOption ? selectedOption : 'Newest'}
				</div>
				<img className="text-slate-200 h-5 2k:h-7" src={Arrows}></img>
			</div>

			{visibleState ? (
				<div id="sort-dropdown" ref={divRef} className="absolute z-110 p-6 flex flex-col gap-2 b-0 w-66 bg-base-500 rounded-xl">
					{children}
				</div>
			) : (
				''
			)}
		</div>
	);
}

/**
 * Displays an option in the list
 * @param {string} displayText - The text to display for the option
 * @param {func} handlerFunc - func to handle clicking (like a state setter)
 * @param {string} selectedOption - the option to highlight when something is selected
 * @returns
 */
export const Option = ({ displayText, id, handlerFunc, selectedOption }) => {
	return (
		<div id={id} onClick={handlerFunc} className={`text-xl 2k:text-2xl text-slate-300 rounded-xl hover:bg-base-100 hover:border-r-4 border-solid border-primary ${selectedOption === id ? 'bg-base-100' : ''} p-4 cursor-pointer`}>
			{displayText}
		</div>
	);
};
export default Select;
