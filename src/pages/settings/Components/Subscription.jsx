import React from 'react';
import { useAuthContext } from '../../../context/auth/AuthContext';
import ManageSubscriptionBtn from './Buttons/ManageSubscriptionBtn';
import SubscribeT1Btn from './Buttons/SubscribeT1Btn';
import SubscribeT2Btn from './Buttons/SubscribeT2Btn';
import SubscribeT3Btn from './Buttons/SubscribeT3Btn';
import SubscriptionPrice from './SubscriptionPrice';

/**
 * Subscription section
 * @returns
 */
function Subscription() {
	const { user } = useAuthContext();

	return (
		<>
			<div className="text-xl 2k:text-3xl text-white font-bold">Subscription</div>
			<h4 className="text-xl 2k:text-3xl text-white">Support every month by Subscribing to help keep KSP Builds running and join an amazing group of space enthusiasts.</h4>
			{user?.subscribed ? (
				<ManageSubscriptionBtn />
			) : (
				<div className="flex flex-col gap-4 2k:gap-8 w-1/2">
					<div className="text-3xl 2k:text-4xl text-slate-300 font-bold mb-4 2k:mb-8">Tiers</div>
					<div className="flex flex-row items-center">
						<SubscribeT1Btn />
						<SubscriptionPrice price="$3.66" />
					</div>
					<div className="flex flex-row items-center">
						<SubscribeT2Btn />
						<SubscriptionPrice price="$7.33" />
					</div>
					<div className="flex flex-row items-center">
						<SubscribeT3Btn />
						<SubscriptionPrice price="$14.68" />
					</div>
				</div>
			)}
		</>
	);
}

export default Subscription;
