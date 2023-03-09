import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CantFind from '../../components/cantFind/CantFind';
import MiddleContainer from '../../components/containers/middleContainer/MiddleContainer';
import Button from '../../components/buttons/Button';
import useResetStates from '../../utilities/useResetStates';

/**
 * 404 Page
 * @returns
 */
function NotFound() {
	const navigate = useNavigate();
	const { resetStates } = useResetStates();

	useEffect(() => {
		resetStates();
	}, []);
	//---------------------------------------------------------------------------------------------------//
	return (
		<MiddleContainer>
			<CantFind text="Oops.. Page not found">
				<h1 className="not-found-404">404</h1>
				<Button text="Return home" icon="left" color="btn-primary" onClick={() => navigate('/')} />
			</CantFind>
		</MiddleContainer>
	);
}

export default NotFound;
