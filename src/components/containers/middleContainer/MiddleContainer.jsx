import React from 'react';

/**
 * Main container in the middle of the page for all of the pages content
 * @param {*} cildren
 * @param {*} color
 * @param {*} size
 * @returns
 */
function MiddleContainer({ children, color, size, css }) {
	return <div className={`flex flex-col gap-4 ${css ? css : ''} ${!color ? 'bg-base-400' : ''} ${color ? color : ''} ${size ? size : 'w-full'} rounded-xl p-6 2k:p-12`}>{children}</div>;
}

export default MiddleContainer;
