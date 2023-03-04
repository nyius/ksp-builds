import { serverTimestamp } from 'firebase/firestore';

export const standardBuild = {
	name: '',
	timestamp: serverTimestamp(),
	description: '',
	image: null,
	build: '',
	author: '',
	uid: '',
	upVotes: 1,
	downVotes: 0,
	kspVersion: `1.0.0`,
	type: [],
	tags: [],
	comments: 0,
	id: '',
	views: 0,
	modsUsed: false,
};
