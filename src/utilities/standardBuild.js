import { serverTimestamp } from 'firebase/firestore';

export const standardBuild = {
	name: '',
	timestamp: serverTimestamp(),
	description: '{"blocks":[{"key":"87rfs","text":"","type":"unstyled","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}}],"entityMap":{}}',
	images: [],
	thumbnail: `https://firebasestorage.googleapis.com/v0/b/kspbuilds.appspot.com/o/images%2Fkspbuilds_bg_sm.png?alt=media&token=22a22144-9cbb-4e31-8dfa-6e6b7b6e3bed`,
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
	visibility: 'public',
};
