import { useAuthContext } from '../../context/auth/AuthContext';

/**
 * Returns the inner component if user is an admin
 * @returns
 */
function IsAdmin({ children }) {
	const { authLoading, user } = useAuthContext();

	if (!authLoading && user && user?.siteAdmin) {
		return children;
	}
}

export default IsAdmin;
