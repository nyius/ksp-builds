import React, { useContext } from 'react';
import Button from '../../buttons/Button';
import AuthContext from '../../../context/auth/AuthContext';
import { setConvosOpen } from '../../../context/auth/AuthActions';

/**
 * Button to close the open messaging popup box
 * @returns
 */
function CloseMessageBoxBtn() {
	const { dispatchAuth } = useContext(AuthContext);

	return <Button onClick={() => setConvosOpen(dispatchAuth, false)} icon="chevron-down" style="btn-circle" color="btn-primary" />;
}

export default CloseMessageBoxBtn;
