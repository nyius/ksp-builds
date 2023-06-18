import React, { useContext } from 'react';
import Button from '../../buttons/Button';
import AuthContext from '../../../context/auth/AuthContext';
import { toast } from 'react-toastify';

/**
 * Displays the upload button
 * @returns
 */
function UploadBtn({ type }) {
	const { authLoading, user } = useContext(AuthContext);
	/**
	 * Checks if the user is logged in before navigating to the upload page, so we can display an erorr if they aren't
	 */
	const handleUploadNavigate = () => {
		if (!authLoading) {
			if (!user?.username) {
				toast.error('You must be signed in to upload a new build!');
			}
		}
	};

	return <Button type="ahref" href="/upload" onClick={handleUploadNavigate} color="btn-accent" css="text-white hidden md:flex" text="Upload" icon="plus" />;
}

export default UploadBtn;
