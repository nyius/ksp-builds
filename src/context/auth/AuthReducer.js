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
			};
		case 'UPDATE_USER':
			const getUserStateUpdate = { ...state.user };
			const newGetUserStateUpdate = Object.assign(getUserStateUpdate, action.payload);

			return {
				...state,
				user: newGetUserStateUpdate,
			};
		case 'GET_USER_DB':
			const getCurrentUserState = { ...state.user };
			const updatedUserState = Object.assign(getCurrentUserState, action.payload);

			return {
				...state,
				user: updatedUserState,
				newUsername: updatedUserState?.username,
				newBio: updatedUserState?.bio,
			};
		case 'CLEAR_NOTIFICATIONS':
			const getClearNotificationsState = { ...state.user };
			getClearNotificationsState.notificationsCount = 0;
			getClearNotificationsState.notifications = [];

			return {
				...state,
				user: getClearNotificationsState,
			};
		case 'SET_DECK_NOTIFICATIONS':
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
		default:
			return state;
	}
};

export default AuthReducer;
