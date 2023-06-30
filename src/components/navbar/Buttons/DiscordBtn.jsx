import React from 'react';
import { FaDiscord } from 'react-icons/fa';
import { Link } from 'react-router-dom';

/**
 * Displays the discord button
 * @returns
 */
function DiscordBtn() {
	return (
		<label className="btn btn-circle w-14 h-14 2k:w-20 2k:h-20 2k:btn-lg avatar text-white">
			<Link to="https://discord.gg/g6YkuGJs" target="_blank" className="w-10 2k:w-20 rounded-full text-4xl items-center justify-center flex">
				<FaDiscord />
			</Link>
		</label>
	);
}

export default DiscordBtn;
