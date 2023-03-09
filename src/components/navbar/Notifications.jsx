import React, { useContext, useState, useEffect } from 'react';
import AuthContext from '../../context/auth/AuthContext';
import { MdOutlineNotificationsNone } from 'react-icons/md';
import Notification from './Notification';
import useAuth from '../../context/auth/AuthActions';

function Notifications() {
	const { authLoading, user } = useContext(AuthContext);
	const [totalUnread, setTotalUnread] = useState(0);
	const { setNotificationsRead } = useAuth();

	/**
	 * Calculates total unread notifications
	 */
	const calcUnreadNotifs = () => {
		setTotalUnread(0);
		user.notifications.map(notif => {
			if (!notif.read) {
				setTotalUnread(prevstate => (prevstate += 1));
			}
		});
	};

	useEffect(() => {
		if (!authLoading && user?.username) {
			calcUnreadNotifs();
		}
	}, [authLoading, user]);

	//---------------------------------------------------------------------------------------------------//
	return (
		<div className="dropdown dropdown-end">
			{!authLoading && user?.username && (
				<>
					<div className="indicator">
						{totalUnread > 0 && <span className="indicator-item indicator-bottom indicator-start badge badge-secondary">{totalUnread}</span>}
						<label onClick={setNotificationsRead} tabIndex={4} className="btn btn-circle w-14 h-14 2k:w-20 2k:h-20 2k:btn-lg avatar">
							<p className="text-4xl">
								<MdOutlineNotificationsNone />
							</p>
						</label>
					</div>
					<ul tabIndex={4} className="mt-3 p-5 2k:p-6 shadow menu dropdown-content gap-2 bg-base-500 rounded-box w-110">
						{user.notifications.map((notif, i) => {
							return <Notification key={i} i={i} notif={notif} />;
						})}
					</ul>
				</>
			)}
		</div>
	);
}

export default Notifications;
