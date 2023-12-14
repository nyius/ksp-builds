import React from 'react';
import Button from '../../buttons/Button';
import { useAuthContext } from '../../../context/auth/AuthContext';
import { toast } from 'react-toastify';

/**
 * Displays the upload button
 * @returns
 */
function UploadBtn() {
	const { authLoading, isAuthenticated } = useAuthContext();
	/**
	 * Checks if the user is logged in before navigating to the upload page, so we can display an erorr if they aren't
	 */
	const handleUploadNavigate = () => {
		if (!authLoading) {
			if (!isAuthenticated) {
				toast.error('You must be signed in to upload a new build!');
			}
		}
	};

	return <Button type="ahref" href={isAuthenticated ? `/upload` : '/login'} onClick={handleUploadNavigate} color="btn-accent" css="text-white hidden md:flex" text="Upload" icon="plus" />;
}

export default UploadBtn;
