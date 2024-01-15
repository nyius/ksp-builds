import React from 'react';

/**
 * Input component
 * @param {*} onChange - function to handle change events
 * @param {*} value
 * @param {*} defaultValue
 * @param {*} margin
 * @param {*} color
 * @param {*} id
 * @param {*} placeholder
 * @param {*} maxLength
 * @param {*} size
 * @param {bool} required
 * @param {*} type - default text, number, etc
 * @returns
 */
function TextInput({ id, onChange, value, defaultValue, placeholder, maxLength, type, size, margin, color, required }) {
	return (
		<input
			id={id}
			required={required}
			type={type ? type : 'text'}
			onChange={onChange}
			maxLength={maxLength}
			value={value}
			defaultValue={defaultValue}
			placeholder={placeholder}
			className={`input ${size ? size : ''} ${margin ? margin : ''} ${color ? color : ''} text-xl 2k:text-2xl 2k:input-lg`}
		/>
	);
}

export default TextInput;
