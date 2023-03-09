import { serverTimestamp } from 'firebase/firestore';

export const standardBuild = {
	name: '',
	timestamp: serverTimestamp(),
	description: '{"blocks":[{"key":"87rfs","text":"","type":"unstyled","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}}],"entityMap":{}}',
	images: [],
	build: '',
	author: '',
	uid: '',
	upVotes: 0,
	downVotes: 0,
	kspVersion: `1.0.0`,
	type: [],
	tags: [],
	commentCount: 0,
	id: '',
	views: 0,
	modsUsed: false,
	video: '',
	downloads: 0,
};
