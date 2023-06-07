import React, { useContext, useState, useEffect } from 'react';
import AuthContext from '../../context/auth/AuthContext';
import { MdOutlineNotificationsNone } from 'react-icons/md';
import Notification from './Notification';
import { useHandleNotifications } from '../../context/auth/AuthActions';
import Button from '../buttons/Button';
import Spinner1 from '../spinners/Spinner1';

function Notifications() {
	const { authLoading, user, notificationsLoading, lastFetchedNotification } = useContext(AuthContext);
	const [totalUnread, setTotalUnread] = useState(0);
	const { handleDeleteAllNotifications, fetchMoreNotifications, setNotificationsRead } = useHandleNotifications();

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
			if (user.notifications) {
				calcUnreadNotifs();
			}
		}
	}, [authLoading, user]);

	//---------------------------------------------------------------------------------------------------//
	return (
		<div className="dropdown dropdown-end">
			{notificationsLoading ? (
				<Spinner1 />
			) : (
				<>
					{user?.username && user?.notifications && (
						<>
							<div className="indicator">
								{totalUnread > 0 && <span className="indicator-item indicator-bottom indicator-start badge badge-secondary 2k:text-2xl 2k:p-4">{totalUnread > 99 ? '99+' : totalUnread}</span>}
								<label onClick={setNotificationsRead} tabIndex={4} className="btn btn-circle w-14 h-14 2k:w-20 2k:h-20 2k:btn-lg avatar">
									<p className="text-4xl">
										<MdOutlineNotificationsNone />
									</p>
								</label>
							</div>
							<ul tabIndex={4} className="mt-3 shadow dropdown-content gap-2 bg-base-900 rounded-box notifications h-fit overflow-auto flex-nowrap relative scrollbar">
								<div className="w-full h-20 flex flex-row items-center justify-center bg-primary text-xl 2k:text-3xl text-white font-bold p-3 2k:p-6">Notifications</div>
								{user.notifications.length > 0 && <Button text="Delete All" size="btn-sm" position="absolute top-2 right-2" color="bg-base-900" onClick={handleDeleteAllNotifications} />}
								<div className="p-5 2k:p-6 flex flex-col gap-2 2k:gap-4">
									{user?.notifications?.length === 0 && <p className="text-xl 2k:text-2xl font-bold">No notifications</p>}
									{user?.notifications?.map((notif, i) => {
										return <Notification key={notif.id} i={i} notif={notif} />;
									})}
								</div>

								{lastFetchedNotification !== 'end' && <Button type="button" text="Load More" icon="reset" color="btn-primary" onClick={fetchMoreNotifications} />}
							</ul>
						</>
					)}
				</>
			)}
		</div>
	);
}

export default Notifications;
