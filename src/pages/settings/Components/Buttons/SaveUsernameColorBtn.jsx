import React, { useContext } from 'react';
import Button from '../../../../components/buttons/Button';
import AuthContext from '../../../../context/auth/AuthContext';
import { updateUsernameColor } from '../../../../context/auth/AuthUtils';

/**
 * Button for saving a change to a username color
 * @param {hex} usernameColor - the new color (eg. ffffff)
 * @returns
 */
function SaveUsernameColorBtn({ usernameColor }) {
	const { user } = useContext(AuthContext);

	if (usernameColor) {
		return <Button text="Save" icon="save" color="btn-accent" size="w-fit" onClick={() => updateUsernameColor(user.uid, usernameColor)} />;
	}
}

export default SaveUsernameColorBtn;
