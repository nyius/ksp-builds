import { serverTimestamp } from 'firebase/firestore';

const standardUserProfile = {
	type: 'userProfile',
	username: '',
	profilePicture: 'https://firebasestorage.googleapis.com/v0/b/kspbuilds.appspot.com/o/astrobiff.png?alt=media&token=25cf08a4-6f0d-4cf6-acb9-c038d0e27d79',
	dateCreated: '',
	accountBirthMonth: '',
	accountBirthDay: '',
	builds: [],
	bio: '',
	followers: [],
	lastModified: serverTimestamp(),
	rocketReputation: 0,
	accolades: [],
	commentCount: 0,
	challengesCompleted: 0,
	dailyChallengesCompleted: 0,
	dailyVisits: 0,
};

export default standardUserProfile;
