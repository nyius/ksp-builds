import React, { useEffect, useState } from 'react';
import AccoladeBrowser from '../../../components/accolades/AccoladeBrowser';
import { useAuthContext } from '../../../context/auth/AuthContext';
import Button from '../../../components/buttons/Button';
import { useAccoladesContext } from '../../../context/accolades/AccoladesContext';

/**
 * Displays the accolades on the users profile
 * @returns
 */
function AccoladesPreview() {
	const { openProfile, fetchingProfile } = useAuthContext();
	const [accoladeCount, setAccoladeCount] = useState(null);
	const { accoladesLoading, totalAccoladeCount } = useAccoladesContext();

	useEffect(() => {
		if (!fetchingProfile && openProfile) {
			setAccoladeCount(openProfile.accolades?.length);
		}
	}, [fetchingProfile, openProfile]);

	//---------------------------------------------------------------------------------------------------//
	return (
		<div className="lg:w-[40rem] 2k:w-[60rem] rounded-xl bg-base-300 shrink-0 flex flex-col h-[30rem] lg:h-full overflow-auto scrollbar relative">
			<div className="flex flex-row place-content-between bg-base-500 items-center rounded-t-xl px-10 py-3 2k:py-6 text-slate-300">
				<div className="flex flex-row place-content-between w-full">
					<div className="text-2xl 2k:text-3xl font-black ">Accolades</div>
					<div className="text-2xl 2k:text-3xl font-black ">
						{!fetchingProfile && accoladeCount ? accoladeCount : 0} / {!accoladesLoading && totalAccoladeCount}
					</div>
				</div>
				<Button color="btn-ghost" icon="right2" type="ahref" tooltip="View all accolades" href={`/user/${openProfile.username}/accolades`} />
			</div>
			<div className="w-full p-8 2k:p-14">{!fetchingProfile && openProfile ? <AccoladeBrowser user={openProfile} type="user" /> : ''}</div>
		</div>
	);
}

export default AccoladesPreview;
