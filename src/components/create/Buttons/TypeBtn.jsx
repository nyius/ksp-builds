import React from 'react';
import Button from '../../buttons/Button';

/**
 * Displays the button for a type
 * @param {string} name - the name of the type (Rocket, Probe, etc)
 * @param {function} setTypes - Function to handle selecting an option
 * @param {arr} typesArr - array of all of the types
 * @returns
 */
function TypeBtn({ name, setTypes, typesArr }) {
	return <Button type="button" color="text-slate-300" text={name} onClick={e => setTypes(name)} css={`btn 2k:btn-lg 2k:text-2xl 2k:font-thin ${typesArr.includes(name) ? 'btn-active bg-primary hover:bg-primary-focus' : ''}`} />;
}

export default TypeBtn;
