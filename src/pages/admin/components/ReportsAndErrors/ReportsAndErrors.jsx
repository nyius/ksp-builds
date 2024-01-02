import React, { useState } from 'react';
import Reports from './Reports/Reports';
import Errors from './Errors/Errors';
import SectionContainer from '../SectionContainer';

function ReportsAndErrors() {
	const [reportTab, setReportTab] = useState(0);

	return (
		<SectionContainer css="!flex-col gap-10" sectionName="Reports and Errors">
			<div className="tabs">
				<a className={`tab tab-lg h-20 px-10 text-3xl text-slate-200 tab-lifted ${reportTab === 0 ? 'tab-active !bg-primary' : 'bg-base-200'}`} onClick={() => setReportTab(0)}>
					Reports/Messages
				</a>
				<a className={`tab tab-lg h-20 px-10 text-3xl text-slate-200 tab-lifted ${reportTab === 1 ? 'tab-active !bg-primary' : 'bg-base-200'}`} onClick={() => setReportTab(1)}>
					Errors
				</a>
			</div>

			<div className="flex !flex-col gap-10">
				<Reports reportTab={reportTab} />

				<Errors reportTab={reportTab} />
			</div>
		</SectionContainer>
	);
}

export default ReportsAndErrors;
