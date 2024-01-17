import React, { useState, useEffect, useRef } from 'react';
import Arrows from '../../assets/up-down-arrows.svg';
import { usePopperTooltip } from 'react-popper-tooltip';
import TooltipPopup from '../tooltip/TooltipPopup';
import { useScrollToElement } from '../../hooks/ScrollToElement';

/**
 * Component for the select box
 * @param {obj} onClick - handles what happens when a item is clicked
 * @param {obj} defaultOption - {id: "", text:""} - the id of the default element and the text to display
 * @param {bool} showTooltip - whether or not to show the tooptip of the current selected option
 * @returns
 */
function Select(onClick, defaultOption, showTooltip) {
	const [dropdownVisible, setDropdownVisible] = useState(false);
	const [selectedOption, setSelectedOption] = useState(defaultOption ? defaultOption : { id: '', text: '' });

	/**
	 * Displays an option in the list
	 * @param {string} displayText - The text to display for the option
	 * @param {func} id - id of the option (like if the option was Date Newest, id could be date_newest)
	 * @returns
	 */
	const Option = ({ displayText, id }) => {
		return (
			<div
				id={id}
				onClick={e => {
					onClick(e);
					setDropdownVisible(false);
					setSelectedOption({ id: id, text: displayText });
				}}
				className={`text-xl 2k:text-2xl text-slate-300 rounded-xl hover:bg-base-100 hover:border-r-4 border-solid border-primary ${selectedOption.id === id ? 'bg-base-100' : ''} p-4 cursor-pointer`}
			>
				{displayText}
			</div>
		);
	};

	/**
	 *
	 * @param {*} selectText - The text to display in the box
	 * @param {*} size - size of the select box
	 * @param {*} dropdownCSS - any css for the dropdown box
	 * @returns
	 */
	const SelectBox = ({ children, selectText, size, dropdownCSS }) => {
		const divRef = useRef(null);
		const { getArrowProps, getTooltipProps, setTooltipRef, setTriggerRef, visible } = usePopperTooltip({ placement: 'top' });

		useEffect(() => {
			// Scroll to the selected option when it changes
			if (divRef.current && selectedOption.id) {
				const selectedOptionElement = divRef.current.querySelector(`#${checkIfIdStartsWithNumAndReturn(selectedOption.id)}`);
				if (selectedOptionElement) {
					selectedOptionElement.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
				}
			}
		}, [selectedOption]);

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
				setDropdownVisible(false);
			}
		};

		//---------------------------------------------------------------------------------------------------//
		return (
			<>
				<div className="relative" ref={setTriggerRef}>
					<div
						className={`rounded-xl ${size ? size : 'w-66'} bg-base-200 flex flex-row items-center hover:bg-base-300 place-content-between border-1 border-solid border-slate-700 text-xl 2k:text-2xl py-4 px-5 text-slate-200 cursor-pointer`}
						onClick={() => setDropdownVisible(!dropdownVisible)}
					>
						<div className="unselectable truncate">
							{selectText} {selectedOption.text ? selectedOption.text : defaultOption.text}
						</div>
						<img className="text-slate-200 h-5 2k:h-7" src={Arrows}></img>
					</div>

					{dropdownVisible ? (
						<div ref={divRef} className={`absolute z-110 max-h-[60rem] overflow-auto scrollbar p-6 flex flex-col gap-2 b-0 ${size ? size : 'w-66'} ${dropdownCSS ? dropdownCSS : ''} bg-base-500 rounded-xl`}>
							{children}
						</div>
					) : (
						''
					)}
				</div>
				{showTooltip ? <TooltipPopup text={selectedOption.text ? selectedOption.text : defaultOption.text} getArrowProps={getArrowProps} visible={visible} getTooltipProps={getTooltipProps} setTooltipRef={setTooltipRef} /> : ''}
			</>
		);
	};
	return { Option, SelectBox };
}

export default Select;

/**
 * Becuase ids shouldn't start with nums, but sometimes do, we need to check for that and return the proper querySelector comapitble ID
 * @param {string} id
 * @returns
 */
const checkIfIdStartsWithNumAndReturn = id => {
	// Check if the id starts with a number
	if (/^\d/.test(id)) {
		// Escape the first character with \\ if it's a number
		return `\\3${id.charAt(0)} ${id.slice(1)}`;
	}

	// Return the original id if it doesn't start with a number
	return id;
};
