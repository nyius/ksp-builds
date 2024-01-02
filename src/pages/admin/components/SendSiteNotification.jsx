import React, { useState } from 'react';
import { sendSiteMessage } from '../utils/sendNotification';
import TextEditor from '../../../components/textEditor/TextEditor';
import Button from '../../../components/buttons/Button';
import SectionContainer from './SectionContainer';

function SendSiteNotification() {
	const [siteNotification, setSiteNotification] = useState('');

	return (
		<SectionContainer css="!flex-col gap-4" sectionName="Send Site Notification">
			<p className="text-2xl 2k:text-4xl text-slate-200 font-bold mb-4">Send Site-wide message</p>
			<TextEditor setState={setSiteNotification} />
			<Button text="send" color="btn-primary" icon="upload" size="w-fit" onClick={() => sendSiteMessage(siteNotification, 'message')} />
		</SectionContainer>
	);
}

export default SendSiteNotification;
