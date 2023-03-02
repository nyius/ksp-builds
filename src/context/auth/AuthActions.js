import { db } from '../../firebase.config';
import { updateDoc, doc, collection } from 'firebase/firestore';
import { useContext } from 'react';
import AuthContext from './AuthContext';

const useAuth = () => {
	const { dispatchAuth, user, newUsername, newBio, editingProfile, verifyChangeUsername } = useContext(AuthContext);

	/**
	 * handles dispatching the new username to the context
	 * @param {*} newValue
	 */
	const setNewUsername = newValue => {
		dispatchAuth({ type: 'SET_NEW_USERNAME', payload: newValue });
	};

	/**
	 * Handles when a user signs up with google and neeeds to enter a username
	 * @param {*} value
	 */
	const setNewGoogleSignup = value => {
		dispatchAuth({ type: 'SET_NEW_GOOGLE_SIGNUP', payload: value });
	};

	/**
	 * Handles updating the users state
	 * @param {*} update
	 */
	const updateUserState = update => {
		dispatchAuth({ type: 'UPDATE_USER', payload: update });
	};

	return { setNewGoogleSignup, updateUserState };
};

export default useAuth;
