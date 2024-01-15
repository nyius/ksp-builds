import React from 'react';
import Button from './Button';
import CheckCredentials from '../credentials/CheckCredentials';

function GiveAccoladeBtn({ username }) {
	return (
		<CheckCredentials type="moderator">
			<Button type="ahref" tooltip="Give Accolade" icon="trophy" href={`accolade-dashboard/${username}`} />
		</CheckCredentials>
	);
}

export default GiveAccoladeBtn;
