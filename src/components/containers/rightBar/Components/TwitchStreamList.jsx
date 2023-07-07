import React, { useContext } from 'react';
import NewsContext from '../../../../context/news/NewsContext';
import TwitchStreamCard from './TwitchStreamCard';
import { FaRocket } from 'react-icons/fa';

import Spinner1 from '../../../spinners/Spinner1';

/**
 * Displays the list of twitch streams
 * @returns
 */
function TwitchStreamList() {
	const { streams, streamsLoading } = useContext(NewsContext);

	if (streamsLoading) return <Spinner1 />;

	if (streams.length === 0) {
		return (
			<div className="flex flex-col gap-4 2k:gap-8 items-center justify-center">
				<p className="text-xl 2k:text-2xl text-slate-400 w-full text-center">
					There are currently no live streams! Go live on{' '}
					<a target="_blank" href="https://www.twitch.tv" className="link">
						twitch.tv
					</a>{' '}
					to have your channel appear here automatically
				</p>
				<p className="text-3xl 2k:text-4xl">
					<FaRocket />
				</p>
			</div>
		);
	}

	return (
		<div className="flex flex-col gap-3 2k:gap-6">
			{!streamsLoading &&
				streams.map(stream => {
					return <TwitchStreamCard key={stream.user_id} stream={stream} />;
				})}
		</div>
	);
}

export default TwitchStreamList;
