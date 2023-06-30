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
				editingBio: false,
				editingEmail: false,
				verifyEditedEmail: null,
				cancelEditProfile: false,
				usernameChanged: false,
				newGoogleSignup: false,
				verifyChangeUsername: false,
				newSignup: false,
				lastFetchedNotification: 'end',
				notificationsLoading: false,
				fetchingProfile: false,
				resetPasswordState: false,
				accountToDelete: null,
				reportingContent: null,
				reportType: '',
				messageTab: null,
				conversations: [],
				newConvo: null,
				hoverUser: null,
				deleteConvoId: null,
				userToBlock: null,
				newSub: false,
				convosOpen: false,
				convosLoading: false,
			};
		case 'UPDATE_USER':
			const getUserStateUpdate = cloneDeep(state.user);
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
			};
		case 'SET_DELETE_CONVO_ID':
			return {
				...state,
				deleteConvoId: action.payload,
			};
		case 'SET_USER_TO_BLOCK':
			return {
				...state,
				userToBlock: action.payload,
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
		case 'UPDATE_FETCHED_USERS_PROFILE':
			const getCurrentFetchedProfilesState = cloneDeep(state.fetchedUserProfiles);
			for (let i = 0; i < getCurrentFetchedProfilesState.length; i++) {
				if (getCurrentFetchedProfilesState[i].uid === action.payload.uid || getCurrentFetchedProfilesState[i].username === action.payload.username) {
					getCurrentFetchedProfilesState[i].followers = action.payload.followers;
					break;
				}
			}

			return {
				...state,
				fetchedUserProfiles: getCurrentFetchedProfilesState,
			};
		case 'UPDATE_OPEN_PROFILE':
			const profileToUpdate = cloneDeep(state.openProfile);
			const updatedProfile = Object.assign(profileToUpdate, action.payload);

			return {
				...state,
				openProfile: updatedProfile,
			};
		case 'CLEAR_NOTIFICATIONS':
			const getClearNotificationsState = { ...state.user };
			getClearNotificationsState.notificationsCount = 0;
			getClearNotificationsState.notifications = [];

			return {
				...state,
				user: getClearNotificationsState,
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
		case 'SET_EDITING_BIO':
			return {
				...state,
				editingBio: action.payload,
			};
		case 'SET_EDITING_EMAIL':
			return {
				...state,
				editingEmail: action.payload,
			};
		case 'SET_VERIFY_EDITED_EMAIL':
			return {
				...state,
				verifyEditedEmail: action.payload,
			};
		case 'SET_LAST_FETCHED_NOTIF':
			return {
				...state,
				lastFetchedNotification: action.payload,
			};
		case 'SET_NEW_SIGNUP':
			return {
				...state,
				newSignup: action.payload,
			};
		case 'SET_ACCOUNT_TO_DELETE':
			return {
				...state,
				accountToDelete: action.payload,
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
		case 'SET_MESSAGE_TAB':
			return {
				...state,
				messageTab: action.payload.messageTab,
			};
		case 'SET_HOVER_USER':
			return {
				...state,
				hoverUser: action.payload,
			};
		case 'SET_REPORT':
			return {
				...state,
				reportingContent: action.payload.reportingContent,
				reportType: action.payload.reportType,
			};
		case 'SET_CONVOS':
			return {
				...state,
				conversations: action.payload,
				convosLoading: false,
			};
		case 'INCOMING_NEW_CONVO':
			const checkIfConvoIncoming = state.conversations.filter(convo => {
				return convo.id === action.payload.id;
			});

			// if we didn't find a matching conversation it means we have a new convo (and go fetch it)
			if (checkIfConvoIncoming.length === 0) {
				return {
					...state,
					newConvo: action.payload,
				};
			}
		case 'NEW_CONVO':
			const checkIfConvo = state.conversations.filter(convo => {
				return convo.id === action.payload.id;
			});

			// if we didn't find a matching conversation it means we have a new convo (and go fetch it)
			if (checkIfConvo.length === 0) {
				return {
					...state,
					conversations: [...state.conversations, action.payload],
					newConvo: null,
				};
			}
		case 'UPDATE_CONVO':
			let conversationUpdateCopy = cloneDeep(state.conversations);

			for (let i = 0; i < conversationUpdateCopy.length; i++) {
				if (conversationUpdateCopy[i].id === action.payload.id) {
					conversationUpdateCopy[i].newMessage = action.payload.newMessage;
					conversationUpdateCopy[i].lastMessage = action.payload.lastMessage;
				}
			}

			return {
				...state,
				conversations: conversationUpdateCopy,
			};
		case 'NEW_MESSAGE':
			let conversationsCloneNew = cloneDeep(state.conversations);
			let newConversation;

			// Loop over all conversations and we see if we have a matching one
			for (let i = 0; i < conversationsCloneNew.length; i++) {
				if (conversationsCloneNew[i].id === action.payload.parent) {
					conversationsCloneNew[i].messages.push(action.payload);
					conversationsCloneNew[i].messages.sort((a, b) => {
						let aDate = new Date(a.timestamp);
						let bDate = new Date(b.timestamp);

						return aDate < bDate ? -1 : 1;
					});
					conversationsCloneNew[i].lastMessageFrom = conversationsCloneNew[i]?.messages[conversationsCloneNew[i]?.messages?.length - 1]?.uid;
					newConversation = conversationsCloneNew[i];
					break;
				}
			}

			if (state.messageTab?.id === action.payload.parent) {
				return {
					...state,
					conversations: conversationsCloneNew,
					messageTab: newConversation,
				};
			} else {
				return {
					...state,
					conversations: conversationsCloneNew,
				};
			}

		default:
			return state;
	}
};

export default AuthReducer;
