import React from 'react';
import { useNavigate, Link } from 'react-router-dom';

/**
 * Private Upload FAQ Card
 * @returns
 */
function KSPBuildsFree() {
	const navigate = useNavigate();

	return (
		<>
			<p className="!text-start p-3">Yes! KSP Builds is completely free to use.</p>
			<p className="!text-start p-3">If you wish, we have a completely optional way to support KSP Builds by either donating or subscribing. This helps us pay for server fees as well as the many coffees needed to keep this thing running.</p>
			<p className="!text-start p-3">
				If you want to subscribe, you can do that by clicking the 'Support KSP Builds' button at the top of the page. You can also do subscribe by navigating to your settings page{' '}
				<span onClick={() => navigate('/settings')} className="link link-accent">
					here
				</span>{' '}
				and scrolling down to the "Subscription" section.
			</p>
			<p className="!text-start p-3">
				If you want to donate, you can do so by clicking the "Donate" button in the footer, or clicking{' '}
				<span to="https://www.paypal.com/donate/?hosted_button_id=CCLY8A74UC328" className="link link-accent" onClick={() => window.open('https://www.paypal.com/donate/?hosted_button_id=CCLY8A74UC328', '_blank')}>
					here
				</span>
				.
			</p>
		</>
	);
}

export default KSPBuildsFree;
