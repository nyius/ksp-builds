import { cloneDeep } from 'lodash';
const AuthReducer = (state, action) => {
	switch (action.type) {
		case 'SET_AUTH':
			return {
				...state,
				...action.payload,
			};
		case 'LOGIN':
			return {
				...state,
				user: action.payload,
			};
		case 'LOGOUT':
			return {
				...state,
				user: null,
				newUsername: '',
				newBio: '',
				editingProfile: false,
				cancelEditProfile: false,
				usernameChanged: false,
				newGoogleSignup: false,
				verifyChangeUsername: false,
			};
		case 'UPDATE_USER':
			const getUserStateUpdate = { ...state.user };
			const newGetUserStateUpdate = Object.assign(getUserStateUpdate, action.payload);

			return {
				...state,
				user: newGetUserStateUpdate,
			};
		case 'SET_USER':
			const getCurrentUserState = { ...state.user };
			const updatedUserState = Object.assign(getCurrentUserState, action.payload);

			return {
				...state,
				user: updatedUserState,
				newUsername: updatedUserState?.username,
				newBio: updatedUserState?.bio,
			};
		case 'SET_FETCHING_PROFILE':
			return {
				...state,
				fetchingProfile: action.payload,
			};
		case 'FETCH_USERS_PROFILE':
			return {
				...state,
				fetchedUserProfile: action.payload,
			};
		case 'CLEAR_NOTIFICATIONS':
			const getClearNotificationsState = { ...state.user };
			getClearNotificationsState.notificationsCount = 0;
			getClearNotificationsState.notifications = [];

			return {
				...state,
				user: getClearNotificationsState,
			};
		case 'SET_BUILD_NOTIFICATIONS':
			const getSetDeckNotifications = [...state.user.disabledNotifications];
			if (getSetDeckNotifications.includes(action.payload)) {
				getSetDeckNotifications.splice(getSetDeckNotifications.indexOf(action.payload), 1);
			} else {
				getSetDeckNotifications.push(action.payload);
			}

			return {
				...state,
				user: {
					...state.user,
					disabledNotifications: getSetDeckNotifications,
				},
			};
		case 'SET_NEW_USERNAME':
			return {
				...state,
				newUsername: action.payload,
			};
		case 'SET_NEW_BIO':
			return {
				...state,
				newBio: action.payload,
			};
		case 'SET_EDITING_PROFILE':
			return {
				...state,
				editingProfile: action.payload,
			};
		case 'SET_NEW_SIGNUP':
			return {
				...state,
				newSignup: action.payload,
			};
		case 'SET_CANCEL_EDIT_PROFILE':
			return {
				...state,
				cancelEditProfile: action.payload,
			};
		case 'SET_CHANGE_USERNAME':
			return {
				...state,
				usernameChanged: action.payload,
			};
		case 'SET_VERIFY_CHANGE_USERNAME':
			return {
				...state,
				verifyChangeUsername: action.payload,
			};
		case 'ADD_BUILD':
			const newUser = cloneDeep(state.user);
			newUser.builds.push(action.payload);

			return {
				...state,
				user: newUser,
			};
		case 'SET_RESET_PASSWORD':
			return {
				...state,
				resetPasswordState: action.payload,
			};
		default:
			return state;
	}
};

export default AuthReducer;
