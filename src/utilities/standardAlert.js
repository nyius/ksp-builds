import { serverTimestamp } from 'firebase/firestore';

export const standardAlert = {
	text: '',
	icon: 'alert',
	timestamp: serverTimestamp(),
	color: 'yellow',
};
