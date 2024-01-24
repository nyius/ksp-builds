import React, { useState } from 'react';
import TextEditor from '../../../components/textEditor/TextEditor';
import Button from '../../../components/buttons/Button';
import SectionContainer from './SectionContainer';
import { cloneDeep } from 'lodash';
import standardNotifications from '../../../utilities/standardNotifications';
import TextInput from '../../../components/input/TextInput';
import { collection, doc, getDoc, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../../firebase.config';
import { toast } from 'react-toastify';
import { sendNotification } from '../../../context/auth/AuthUtils';

function SendNotificationToUser() {
	const [notification, setNotification] = useState('');
	const [username, setUsername] = useState('');
	const [type, setType] = useState('');

	const handleSendNotif = async () => {
		try {
			if (!notification) {
				toast.error('Forgot a message');
				return;
			}
			if (username === '') {
				toast.error('Forgot a username');
				return;
			}
			if (type === '') {
				toast.error('Forgot a type');
				return;
			}

			let q = query(collection(db, 'users'), where('username', '==', username));
			const userSnap = await getDocs(q);

			userSnap.forEach(userData => {
				const newNotif = cloneDeep(standardNotifications);
				newNotif.uid = 'ZyVrojY9BZU5ixp09LftOd240LH3';
				newNotif.username = 'nyius';
				newNotif.timestamp = new Date();
				newNotif.profilePicture =
					'https://firebasestorage.googleapis.com/v0/b/kspbuilds.appspot.com/o/images%2FZyVrojY9BZU5ixp09LftOd240LH3-selfie.png-9d4dfce8-3c29-41b1-8e64-4c4a3ec4c440?alt=media&token=5825b603-893c-4471-accc-65ada96b06f9';
				newNotif.message = notification;
				newNotif.type = type;
				delete newNotif.buildId;
				delete newNotif.buildName;
				delete newNotif.comment;
				delete newNotif.commentId;

				sendNotification(userData.id, newNotif);
			});

			toast.success('Message sent!');
		} catch (error) {
			console.log(error);
		}
	};

	//---------------------------------------------------------------------------------------------------//
	return (
		<SectionContainer sectionName="Send Notification to User">
			<div className="flex flex-col gap-4 2k:gap-6">
				<p className="text-2xl 2k:text-4xl text-slate-200 font-bold mb-4">Send a notification to a user</p>
				<TextInput placeholder="Enter username" onChange={e => setUsername(e.target.value)} />
				<p className="text-xl 2k:text-2xl text-slate-300">Type: (message, welcome, update, buildOfTheWeek, accolade, reply, comment)</p>
				<TextInput placeholder="Enter notification type" onChange={e => setType(e.target.value)} />
				<TextEditor setState={setNotification} />
				<Button text="send" color="btn-primary" icon="upload" size="w-fit" onClick={() => handleSendNotif()} />
			</div>
		</SectionContainer>
	);
}

export default SendNotificationToUser;
