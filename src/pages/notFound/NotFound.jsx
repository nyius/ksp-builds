import React from 'react';
import { useNavigate } from 'react-router-dom';
import CantFind from '../../components/cantFind/CantFind';
import MiddleContainer from '../../components/containers/middleContainer/MiddleContainer';
import Button from '../../components/buttons/Button';

/**
 * 404 Page
 * @returns
 */
function NotFound() {
	const navigate = useNavigate();

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
