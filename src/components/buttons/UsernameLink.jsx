import React, { useEffect, useContext, useState } from 'react';
import { BsFillPatchCheckFill } from 'react-icons/bs';
import { useNavigate } from 'react-router-dom';
import Button from './Button';
import useAuth from '../../context/auth/AuthActions';
import AuthContext from '../../context/auth/AuthContext';

function UsernameLink({ username, uid, hoverPosition, noHoverUi, color }) {
	const { user, hoverUser } = useContext(AuthContext);
	const navigate = useNavigate();
	const { fetchConversation, setReport } = useAuth();
	const [hover, setHover] = useState(false);
	let hoverTimer, hoverOutTimer;

	const handleBlur = e => {
		if (!e.currentTarget.contains(e.relatedTarget)) {
			cancelHoverTimer();

			hoverOutTimer = setTimeout(() => {
				setHover(false);
			}, 400);
		}
	};

	const handleHover = () => {
		cancelHoverOutTimer();

		hoverTimer = setTimeout(() => {
			setHover(true);
		}, 400);
	};

	const cancelHoverTimer = () => {
		clearTimeout(hoverTimer);
	};

	const cancelHoverOutTimer = () => {
		clearTimeout(hoverOutTimer);
	};

	/**
	 * Handles setting the reported comment
	 */
	const handleSetReport = () => {
		setReport('user', { uid, username });
	};

	return (
		<>
			<div className="dropdown z-100" onMouseEnter={handleHover} onMouseLeave={e => handleBlur(e)} onClick={e => e.stopPropagation()}>
				<div id="userlink" className={`text-xl 2k:text-3xl link link-hover ${username === 'nyius' ? 'link-secondary' : 'link-accent'} flex flex-row gap-2 itms-center `} onClick={() => navigate(`/profile/${username}`)}>
					{username}
					{username === 'nyius' && <BsFillPatchCheckFill />}
				</div>
				{!noHoverUi && hover && (
					<div
						className={`absolute z-50 -top-0 -translate-x-1/3 -translate-y-full ${hoverPosition === 'right' && '!-translate-x-0'} ${hoverPosition === 'bottom-right' && '!top-6 !translate-y-0 !-translate-x-0'} ${
							hoverPosition === 'top-left' && '!-translate-x-3/4'
						} cursor-auto bg-base-900 p-2 shadow ${color ? color : 'bg-base-100'}  rounded-box w-111 2k:w-117`}
					>
						<div className="flex flex-col p-3 w-full">
							<p className="text-xl 2k:text-2xl text-white">{username}</p>

							{user?.username && username === 'nyius' && <p className="text-xl 2k:text-2xl text-secondary font-bold w-full">KSP Builds Founder</p>}
							<div className="divider"></div>

							<div className="flex flex-row flex-wrap items-center gap-2 2k:gap-4 w-full">
								{user?.username && user?.username !== username && <Button id="userLinkMessage" text="Message" icon="message" color="btn-primary" size="w-fit" onClick={e => fetchConversation({ username, uid })} />}
								<Button text="Visit" color="btn-primary" size="w-fit" icon="export" type="ahref" href={`/profile/${username}`} />
								{user?.username && user?.username !== username && <Button htmlFor="report-modal" color="btn-ghost" icon="report" size="!btn-sm w-fit" text="Report" onClick={handleSetReport} />}
							</div>
						</div>
					</div>
				)}
			</div>
		</>
	);
}

export default UsernameLink;
