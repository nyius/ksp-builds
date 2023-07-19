import React from 'react';
import { useAuthContext } from '../../../context/auth/AuthContext';
import { TwitterPicker } from 'react-color';
import SaveUsernameColorBtn from './Buttons/SaveUsernameColorBtn';
import { useReturnUsernameCustomColor } from '../../../context/auth/AuthActions';

/**
 * Username color picker component
 * @returns
 */
function UsernameColor() {
	const { user } = useAuthContext();
	const [usernameColor, setUsernameColor] = useReturnUsernameCustomColor(null);

	/**
	 * Handles a user changing their username color
	 * @param {*} color
	 * @param {*} e
	 */
	const handleUsernameColorChange = (color, e) => {
		setUsernameColor(color.hex);
	};

	return (
		<>
			<div className="text-xl 2k:text-3xl text-white font-bold mb-4">Username Color</div>
			<div style={{ color: `${usernameColor}` }} className={`text-2xl 2k:text-4xl font-bold mb-4 text-accent`}>
				{user.username}
			</div>
			<div className="flex flex-row gap-4 2k:gap-8 w-full flex-wrap">
				<TwitterPicker
					colors={user?.subscribed ? ['#1fb2a5', '#661ae6', '#d926aa', '#FF6900', '#FCB900', '#7BDCB5', '#00D084', '#8ED1FC', '#0693E3', '#ABB8C3', '#EB144C', '#F78DA7', '#9900EF'] : ['#1fb2a5']}
					onChange={handleUsernameColorChange}
				/>
				<div className="flex flex-col w-fit">
					<p className="text-xl 2k:text-2xl text-slate-300 mb-3 text-center">Light Mode</p>
					<div className="w-full h-44 px-20 text-2xl 2k:text-4xl font-bold items-center flex justify-center text-accent rounded-xl bg-slate-100" style={{ color: `${usernameColor}` }}>
						{user.username}
					</div>
				</div>
				<div className="flex flex-col w-fit">
					<p className="text-xl 2k:text-2xl text-slate-300 mb-3 text-center">Dark Mode</p>
					<div className="w-full h-44 px-20 text-2xl 2k:text-4xl font-bold items-center flex justify-center text-accent rounded-xl bg-base-800" style={{ color: `${usernameColor}` }}>
						{user.username}
					</div>
				</div>
			</div>
			{user?.subscribed ? (
				<>
					<SaveUsernameColorBtn usernameColor={usernameColor} />
				</>
			) : (
				<div className="text-2xl 2k:text-3xl">Subscribe to change your username color! </div>
			)}
		</>
	);
}

export default UsernameColor;
