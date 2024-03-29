import { serverTimestamp } from 'firebase/firestore';

const standardUser = {
	type: 'user',
	name: '',
	email: '',
	username: '',
	notificationsAllowed: true,
	blockedNotifications: [],
	blockedUsers: [],
	allowPrivateMessaging: true,
	accolades: [],
	bio: '{"blocks":[{"key":"5mft5","text":"Nothing to see here...","type":"unstyled","depth":0,"inlineStyleRanges":[{"offset":0,"length":22,"style":"ITALIC"}],"entityRanges":[],"data":{}}],"entityMap":{}}',
	favorites: [],
	hangars: [],
	profilePicture: 'https://firebasestorage.googleapis.com/v0/b/kspbuilds.appspot.com/o/astrobiff.png?alt=media&token=25cf08a4-6f0d-4cf6-acb9-c038d0e27d79',
	siteAdmin: false,
	dateCreated: '',
	accountBirthMonth: '',
	accountBirthDay: '',
	upVotes: [],
	downVotes: [],
	builds: [],
	rocketReputation: 0,
	commentCount: 0,
	challengesCompleted: 0,
	dailyChallengesCompleted: 0,
	dailyVisits: 0,
	lastVisit: serverTimestamp(),
};

export default standardUser;
