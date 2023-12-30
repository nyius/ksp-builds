import React, { useEffect, useState } from 'react';
import { IoIosAlert, IoIosWarning, IoIosCloseCircleOutline } from 'react-icons/io';
import { useAuthContext } from '../../context/auth/AuthContext';

const getIcon = icon => {
	switch (icon) {
		case 'alert':
			return <IoIosAlert />;
		case 'warning':
			return <IoIosWarning />;
		default:
			return '';
	}
};

const getColor = color => {
	switch (color) {
		case 'red':
			return 'bg-error';
		case 'yellow':
			return 'bg-yellow-600';
		case 'green':
			return 'bg-success';
		case 'primary':
			return 'bg-primary';
		case 'secondary':
			return 'bg-secondary';
		case 'accent':
			return 'bg-accent';
		default:
			return 'bg-yellow-600';
	}
};

function AlertBar({ css }) {
	const { alert, alertLoading } = useAuthContext();
	const [hiddenAlert, setHiddenAlert] = useState(true);

	// Check the users hidden alert and see if its older than the newest alert
	useEffect(() => {
		const localAlert = localStorage.getItem('hideAlert');
		if (!localAlert) setHiddenAlert(false); //if the user doesnt have a localAlert, they have never hid an alert

		if (!alertLoading && alert && alert.text) {
			if (alert.timestamp.seconds === Number(localAlert)) {
				setHiddenAlert(true);
			} else {
				setHiddenAlert(false);
			}
		}
	}, [alertLoading, alert]);

	/**
	 * Handles hiding the alert bar
	 */
	const handleCloseAlertBar = () => {
		localStorage.setItem('hideAlert', alert.timestamp.seconds);
		setHiddenAlert(true);
	};

	//---------------------------------------------------------------------------------------------------//
	if (!alertLoading && alert && !hiddenAlert) {
		return (
			<div
				className={`w-full top-[4rem] fixed font-bold z-[100] h-fit ${alert.color === 'green' ? 'text-slate-800' : 'text-white'} px-4 2k:px-8 py-4 2k:py-8 ${css ? css : ''} ${
					alert.color ? getColor(alert.color) : 'bg-yellow-600'
				} text-xl 2k:text-3xl text-center `}
			>
				<div className="relative w-full h-full flex flex-row items-center justify-center gap-2 px-20">
					{alert.icon ? <span className="text-3xl 2k:text-4xl">{getIcon(alert.icon)}</span> : ''}
					{alert.text}
					<div className="absolute right-10 top-0 cursor-pointer text-3xl 2k:text-4xl" onClick={handleCloseAlertBar}>
						<IoIosCloseCircleOutline />
					</div>
				</div>
			</div>
		);
	}
}

export default AlertBar;
