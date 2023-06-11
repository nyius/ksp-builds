import React, { useContext } from 'react';
import BuildContext from '../../../context/build/BuildContext';
import BuildInfoCard from '../../../components/cards/BuildInfoCard';
import BotwBadge from '../../../assets/BotW_badge2.png';
import UsernameLink from '../../../components/buttons/UsernameLink';
import Button from '../../../components/buttons/Button';

/**
 * Displays build info like date created, author, part count, etc
 * @returns
 */
function BuildInfo() {
	const { loadedBuild } = useContext(BuildContext);

	return (
		<div className="flex flex-row flex-wrap gap-4 2k:gap-5 bg-base-900 w-full justify-center p-2 2k:p-4 mb-6 2k:mb-12 rounded-xl">
			<BuildInfoCard title="Author">
				<UsernameLink username={loadedBuild.author} uid={loadedBuild.uid} />
			</BuildInfoCard>

			<BuildInfoCard title="Date Created">
				<p className="text-xl 2k:text-2xl text-accent">{new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'long', day: '2-digit' }).format(loadedBuild.timestamp.seconds * 1000)}</p>
			</BuildInfoCard>

			<BuildInfoCard title="Last Updated">
				<p className="text-xl 2k:text-2xl text-accent">{new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'long', day: '2-digit' }).format(loadedBuild.lastModified.seconds * 1000)}</p>
			</BuildInfoCard>

			<BuildInfoCard title="KSP Version">
				<p className="text-xl 2k:text-2xl text-accent">{loadedBuild.kspVersion}</p>
			</BuildInfoCard>

			<BuildInfoCard title="Part Count">
				<p className="text-xl 2k:text-2xl text-accent">{loadedBuild.partCount}</p>
			</BuildInfoCard>

			<BuildInfoCard title="Uses Mods">
				<p className="text-xl 2k:text-2xl text-accent">{loadedBuild.modsUsed ? 'Yes' : 'None'}</p>
			</BuildInfoCard>

			<BuildInfoCard title="Downloads">
				<p className="text-xl 2k:text-2xl text-accent">{loadedBuild.downloads}</p>
			</BuildInfoCard>

			{loadedBuild.buildOfTheWeek ? (
				<BuildInfoCard title="Build of the Week">
					<img src={BotwBadge} alt="" className="w-22 2k:w-30" />
					<p className="text-lg xl:text-xl 2k:text-2xl italic text-slate-500 ">{new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'long', day: '2-digit' }).format(loadedBuild.buildOfTheWeek.seconds * 1000)}</p>
				</BuildInfoCard>
			) : null}

			{loadedBuild.forChallenge ? (
				<BuildInfoCard title="Challenge">
					<Button type="ahref" href={`/challenges/${loadedBuild.forChallenge}`} color="btn-ghost text-accent" css="single-line-truncat" text={loadedBuild.challengeTitle} size="!text-xl 2k:!text-2xl font-thin !normal-case !h-fit" />
				</BuildInfoCard>
			) : null}
		</div>
	);
}

export default BuildInfo;
