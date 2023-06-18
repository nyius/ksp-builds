import React, { useContext } from 'react';
import Button from '../../buttons/Button';
import { setConvoTab } from '../../../context/auth/AuthActions';
import AuthContext from '../../../context/auth/AuthContext';

/**
 * Button to go back to the users list of convos
 * @returns
 */
function BackToConvosBtn() {
	const { dispatchAuth } = useContext(AuthContext);

	return <Button icon="left2" style="btn-circle" color="btn-primary" onClick={() => setConvoTab(dispatchAuth, null)} />;
}

export default BackToConvosBtn;
