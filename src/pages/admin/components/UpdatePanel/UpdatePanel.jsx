import React, { useState } from 'react';
import NewVersion from './NewVersion';
import UpdateAllUsers from './UpdateAllUsers';
import UpdateAllBuilds from './UpdateAllBuilds';
import UpdateAllAmazonS3StorageItems from './UpdateAllAmazonS3StorageItems';
import UpdateUser from './UpdateUser';
import AddTestUsers from './AddTestUsers';
import SectionContainer from '../SectionContainer';
import RemoveTestUsers from './RemoveTestUsers';

function UpdatePanel() {
	return (
		<SectionContainer sectionName="Update Panel">
			<div className="flex flex-col gap-8 2k:gap-12">
				<NewVersion />
				<div className="divider my-0"></div>
				<UpdateAllUsers />
				<div className="divider my-0"></div>

				<UpdateAllBuilds />
				<div className="divider my-0"></div>

				<UpdateAllAmazonS3StorageItems />
				<div className="divider my-0"></div>

				<UpdateUser />
				<div className="divider my-0"></div>

				<AddTestUsers />
				<div className="divider my-0"></div>

				<RemoveTestUsers />

				{/* <div className="flex flex-col gap-4 place-content-between">
                <p className="text-2xl 2k:text-4xl text-slate-200 font-bold">Verify Twitter</p>
                <Button color="btn-primary" text="Verify Twitter" onClick={verifyTwitter} />
            </div>

            <div className="divider divider-horizontal"></div>

            <div className="flex flex-col gap-4 place-content-between">
                <p className="text-2xl 2k:text-4xl text-slate-200 font-bold">Tweet</p>
                <Button color="btn-primary" text="Tweet" onClick={tweet} />
            </div> */}
			</div>
		</SectionContainer>
	);
}

export default UpdatePanel;
