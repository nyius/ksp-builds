import React, { useContext } from 'react';
import AuthContext from '../../context/auth/AuthContext';
import Notification from './Notification';
import Spinner1 from '../spinners/Spinner1';
import NotificationsIcon from './Components/NotificationsIcon';
import NewNotificationIcon from './Components/NewNotificationIcon';
import DeleteAllNotifsBtn from './Buttons/DeleteAllNotifsBtn';
import LoadMoreBtn from './Buttons/LoadMoreBtn';

/**
 * Displays the users notifications
 * @returns
 */
function Notifications() {
	const { user, notificationsLoading } = useContext(AuthContext);

	if (notificationsLoading) {
		return <Spinner1 />;
	}

	//---------------------------------------------------------------------------------------------------//
	return (
		<div className="dropdown dropdown-end">
			{user?.username && user?.notifications ? (
				<>
					<div className="indicator">
						<NewNotificationIcon />
						<NotificationsIcon />
					</div>
					<ul tabIndex={4} className="mt-3 shadow dropdown-content gap-2 bg-base-900 rounded-box notifications h-fit overflow-auto flex-nowrap relative scrollbar">
						<div className="w-full h-20 flex flex-row items-center justify-center bg-primary text-xl 2k:text-3xl text-white font-bold p-3 2k:p-6">Notifications</div>
						<DeleteAllNotifsBtn />
						<div className="p-5 2k:p-6 flex flex-col gap-2 2k:gap-4">
							{user?.notifications?.length === 0 && <p className="text-xl 2k:text-2xl font-bold">No notifications</p>}
							{user?.notifications?.map((notif, i) => {
								return <Notification key={notif.id} i={i} notif={notif} />;
							})}
						</div>

						<LoadMoreBtn />
					</ul>
				</>
			) : null}
		</div>
	);
}

export default Notifications;
