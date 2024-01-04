import React from 'react';
import Button from '../../../buttons/Button';

/**
 * Button to visit a profile
 * @param {string} username - username of user to vistit
 * @param {string} text - text to display
 * @returns
 */
function VisitBtn({ username, text }) {
	return <Button tooltip="visit" text={text} color="btn-primary" size="w-fit" icon="export" type="ahref" href={`/user/${username}`} />;
}

export default VisitBtn;
