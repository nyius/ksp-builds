import React, { useEffect, useState } from 'react';
import { useAuthContext } from '../../../context/auth/AuthContext';
import Hangar from '../../folders/Components/Hangar';
import { useBuildContext } from '../../../context/build/BuildContext';
import { useHangarContext } from '../../../context/hangars/HangarContext';
import { useSetPersonalBuildsHangar } from '../../../context/hangars/HangarActions';
import { ReactComponent as HangarIcon } from '../../../assets/hangar.svg';
import { BsChevronBarRight } from 'react-icons/bs';

function HangarBar() {
	const { isAuthenticated, user } = useAuthContext();
	const { dragBuild } = useBuildContext();
	const { savingToHangar } = useHangarContext();
	const [visible, setVisible] = useState(false);
	const [ownBuildsHangar] = useSetPersonalBuildsHangar({ id: 'your-builds', hangarName: 'Your Builds', builds: [], urlName: '' }, true);

	useEffect(() => {
		if (dragBuild) {
			setVisible(true);
		} else {
			if (savingToHangar) {
				setTimeout(() => {
					setVisible(false);
				}, 1400);
			} else {
				setVisible(false);
			}
		}
	}, [dragBuild]);

	if (isAuthenticated && user?.hangars) {
		return (
			<div
				className={`fixed left-2 lg:left-auto lg:top-1/2 lg:-translate-y-1/2 rounded-xl ${
					visible ? 'bottom-0 lg:bottom-auto lg:right-0' : '-bottom-[45rem] lg:bottom-auto -right-[25rem] 2k:-right-[30rem]'
				} h-fit z-100 transition-all flex flex-col lg:flex-row  justify-center`}
			>
				<div
					className={`border-r-0 hover:border-b-4 lg:hover:border-b-0 lg:hover:border-r-4 text-slate-200 border-primary w-fit h-fit bg-base-600 z-100 transition-all ${
						visible ? 'py-5 px-2' : 'py-2 px-3 lg:p-3 2k:p-5'
					} rounded-xl flex flex-col items-center justify-center cursor-pointer`}
					onClick={() => setVisible(!visible)}
				>
					<div className="flex flex-row lg:flex-col gap-4 lg:gap-0 items-center">
						<div className="flex items-center justify-center">
							{visible ? (
								<div className="text-xl lg:text-2xl 2k:text-4xl rotate-90 lg:rotate-0">
									<BsChevronBarRight />
								</div>
							) : (
								<HangarIcon fill="white" stroke="current" alt="" className="w-12 h-12 2k:w-14 2k:h-14" />
							)}
						</div>

						{!visible ? <div className="text-sm lg:text-md 2k:text-lg tracking-widest font-medium">HANGARS</div> : null}
					</div>
				</div>
				<div className="flex flex-col gap-2 2K:gap-10 items-center justify-center px-5 py-4 bg-base-600 w-[25rem] 2k:w-[30rem] shadow-xl">
					<div className="text-xl lg:text-2xl 2k:text-3xl text-slate-100 font-semibold w-full bg-primary text-center py-4 px-6 rounded-t-lg border-b-4 border-primary-focus border-solid">Drag & Drop a Build on Hangar to Save</div>
					<Hangar hangar={ownBuildsHangar} editable={false} sidebar={true} />
					{user.hangars?.map(hangar => {
						return <Hangar key={hangar.id} hangar={hangar} editable={true} sidebar={true} />;
					})}
				</div>
			</div>
		);
	}
}

export default HangarBar;
