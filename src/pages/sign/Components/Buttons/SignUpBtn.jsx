import React from 'react';
import Button from '../../../../components/buttons/Button';
import { toast } from 'react-toastify';
import useAuth from '../../../../context/auth/AuthActions';
import { checkMatchingEmails } from '../../../../context/auth/AuthUtils';

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
			console.log('No email');
			toast.error('You forgot an email!');
			return;
		}
		if (!newUser.password) {
			console.log(`No password`);
			toast.error('You forget a password');
			return;
		}
		if (newUser.password.length < 6) {
			console.log(`Password too Short`);
			toast.error('Password must be more than 6 characters');
			return;
		}
		if (!checkMatchingEmails(newUser.email, newUser.emailVerify)) {
			console.log(`Emails don't match`);
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
