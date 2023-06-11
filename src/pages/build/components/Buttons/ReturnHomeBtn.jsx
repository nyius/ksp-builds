import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../../../components/buttons/Button';

/**
 * Button to return home if build isnt found
 * @returns
 */
function ReturnHomeBtn() {
	const navigate = useNavigate();

	return <Button color="btn-primary" onClick={() => navigate('/')} text="Return Home" icon="left" />;
}

export default ReturnHomeBtn;
