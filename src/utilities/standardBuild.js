import { serverTimestamp } from 'firebase/firestore';

export const standardBuild = {
	name: '',
	timestamp: serverTimestamp(),
	description: '',
	images: [],
	build: '',
	author: '',
	uid: '',
	upVotes: 1,
	downVotes: 0,
	kspVersion: `1.0.0`,
	type: [],
	tags: [],
	commentCount: 0,
	id: '',
	views: 0,
	modsUsed: false,
	video: '',
};
