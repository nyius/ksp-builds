import React from 'react';
import Button from '../../buttons/Button';

/**
 * Displays the mobile navbar button
 * @param {*} text - the text on the button
 * @param {*} href - the url
 * @param {*} icon - the icon on the button
 * @returns
 */
function MobileBtn({ text, href, icon, htmlFor }) {
	return <Button size="w-full" htmlFor={htmlFor} href={href} type={href ? 'ahref' : null} color="btn-ghost" css="border-2 border-solid border-slate-500 space-between" text={text} icon={icon} />;
}

export default MobileBtn;
