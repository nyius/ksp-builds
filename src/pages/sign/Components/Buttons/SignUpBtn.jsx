import React from 'react';
import Button from '../../../../components/buttons/Button';
import { toast } from 'react-toastify';
import useAuth from '../../../../context/auth/AuthActions';
import { checkMatchingEmails } from '../../../../context/auth/AuthUtils';
import errorReport from '../../../../utilities/errorReport';

/**
 * Button for signing up a user
 * @param {obj} newUser - the new user object to create
 * @param {setter} setAccountExists - the setter function to update if the account exists
 * @returns
 */
function SignUpBtn({ newUser, setAccountExists }) {
	const { newEmailAccount } = useAuth();

	const signUp = async () => {
		if (!newUser.email) {
			errorReport('No email', false, 'signUp');
			toast.error('You forgot an email!');
			return;
		}
		if (!newUser.password) {
			errorReport(`No password`, false, 'signUp');
			toast.error('You forget a password');
			return;
		}
		if (newUser.password.length < 6) {
			errorReport(`Password too Short`, false, 'signUp');
			toast.error('Password must be more than 6 characters');
			return;
		}
		if (!checkMatchingEmails(newUser.email, newUser.emailVerify)) {
			errorReport(`Emails don't match`, false, 'signUp');
			toast.error("Your emails don't match");
			return;
		}

		const signinStatus = await newEmailAccount(newUser);

		if (signinStatus?.message === 'exists') {
			setAccountExists(true);
		}
	};

	return <Button text="Submit" margin="mb-10 2k:mb-16 mt-10 2k:mt-16" icon="save" color="btn-primary" onClick={() => signUp()} />;
}

export default SignUpBtn;
