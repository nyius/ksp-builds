import React, { useEffect, useState } from 'react';
import { useAuthContext } from '../../../context/auth/AuthContext';
import Folder from '../../folders/Components/Folder';
import { useBuildContext } from '../../../context/build/BuildContext';
import { useFoldersContext } from '../../../context/folders/FoldersContext';
import { FaFolder } from 'react-icons/fa';
import { BsChevronBarRight } from 'react-icons/bs';
import { useSetPersonalBuildsFolder } from '../../../context/folders/FoldersActions';

function FolderBar() {
	const { isAuthenticated, user } = useAuthContext();
	const { dragBuild } = useBuildContext();
	const { savingToFolder } = useFoldersContext();
	const [visible, setVisible] = useState(false);
	const [ownBuildsFolder] = useSetPersonalBuildsFolder({ id: 'your-builds', folderName: 'Your Builds', builds: [], urlName: '' }, true);

	useEffect(() => {
		if (dragBuild) {
			setVisible(true);
		} else {
			if (savingToFolder) {
				setTimeout(() => {
					setVisible(false);
				}, 1400);
			} else {
				setVisible(false);
			}
		}
	}, [dragBuild]);

	if (isAuthenticated && user?.folders) {
		return (
			<div
				className={`fixed left-2 lg:left-auto lg:top-1/2 lg:-translate-y-1/2 rounded-xl ${
					visible ? 'bottom-0 lg:bottom-auto lg:right-0' : '-bottom-[45rem] lg:bottom-auto lg:-right-[30rem]'
				} h-fit z-100 transition-all flex flex-col lg:flex-row  justify-center`}
			>
				<div
					className={`border-r-0 hover:border-b-4 lg:hover:border-b-0 lg:hover:border-r-4 text-slate-200 border-primary w-fit h-fit bg-base-600 z-100 transition-all ${
						visible ? 'py-5 px-2' : 'py-2 px-3 lg:p-5'
					} rounded-xl flex flex-col items-center justify-center cursor-pointer`}
					onClick={() => setVisible(!visible)}
				>
					<div className="flex flex-row lg:flex-col gap-4 lg:gap-0 items-center">
						<div className="text-4xl lg:text-5xl flex items-center justify-center">
							{visible ? (
								<div className="rotate-90 lg:rotate-0">
									<BsChevronBarRight />
								</div>
							) : (
								<FaFolder />
							)}
						</div>

						{!visible ? <div className="tracking-widest font-medium">FOLDERS</div> : null}
					</div>
				</div>
				<div className="flex flex-col gap-10 items-center justify-center px-5 py-4 bg-base-600 w-[30rem] shadow-xl">
					<div className="text-2xl 2k:text-3xl text-slate-100 font-semibold w-full bg-primary text-center py-4 px-6 rounded-t-lg border-b-4 border-primary-focus border-solid">Drag & Drop a Build on Folder to Save</div>
					<Folder folder={ownBuildsFolder} editable={false} sidebar={true} />
					{user.folders.map(folder => {
						return <Folder key={folder.id} folder={folder} editable={true} sidebar={true} />;
					})}
				</div>
			</div>
		);
	}
}

export default FolderBar;
