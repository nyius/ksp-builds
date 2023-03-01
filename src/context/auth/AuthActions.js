import { db } from '../../firebase.config';
import { updateDoc, doc, collection } from 'firebase/firestore';
import { useContext } from 'react';
import AuthContext from './AuthContext';

const useAuth = () => {
	const { dispatchAuth, user, newUsername, newBio, editingProfile, verifyChangeUsername } = useContext(AuthContext);
};
