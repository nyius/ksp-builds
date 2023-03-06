import React, { useState, useContext, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import AuthContext from '../../context/auth/AuthContext';
import useAuth from '../../context/auth/AuthActions';

function VisitProfile() {
	const usersId = useParams().id;
	const [fetchedUser, setFetchedUser] = useState(null);

	// Fetch users profile
	useEffect(() => {
		//
	}, []);

	return <div className="flex flex-col gap-4 bg-base-400 w-full rounded-xl p-6">Users Profile</div>;
}

export default VisitProfile;
