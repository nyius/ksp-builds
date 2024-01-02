import React, { useState } from 'react';
import NewVersion from './NewVersion';
import UpdateAllUsers from './UpdateAllUsers';
import UpdateAllBuilds from './UpdateAllBuilds';
import UpdateAllAmazonS3StorageItems from './UpdateAllAmazonS3StorageItems';
import UpdateUser from './UpdateUser';
import AddTestUsers from './AddTestUsers';
import SectionContainer from '../SectionContainer';

function UpdatePanel() {
	return (
		<SectionContainer css="!gap-8" sectionName="Update Panel">
			<NewVersion />

			<div className="divider divider-horizontal"></div>

			<UpdateAllUsers />

			<div className="divider divider-horizontal"></div>

			<UpdateAllBuilds />

			<div className="divider divider-horizontal"></div>

			<UpdateAllAmazonS3StorageItems />

			<div className="divider divider-horizontal"></div>

			<UpdateUser />

			<div className="divider divider-horizontal"></div>

			<AddTestUsers />

			{/* <div className="flex flex-col gap-4 place-content-between">
                <p className="text-2xl 2k:text-4xl text-slate-200 font-bold">Verify Twitter</p>
                <Button color="btn-primary" text="Verify Twitter" onClick={verifyTwitter} />
            </div>

            <div className="divider divider-horizontal"></div>

            <div className="flex flex-col gap-4 place-content-between">
                <p className="text-2xl 2k:text-4xl text-slate-200 font-bold">Tweet</p>
                <Button color="btn-primary" text="Tweet" onClick={tweet} />
            </div> */}
		</SectionContainer>
	);
}

export default UpdatePanel;
