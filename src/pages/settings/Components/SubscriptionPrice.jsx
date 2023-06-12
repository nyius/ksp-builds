import React from 'react';

/**
 * Displays a price for a sub
 * @param {string} price - the price of the sub (eg. $3.00)
 * @returns
 */
function SubscriptionPrice({ price }) {
	return <p className="text-lg 2k:text-2xl text-white font-bold bg-base-500 rounded-xl flex items-center justify-center w-full px-6 2k:px-8 h-12 2k:h-16">US{price}</p>;
}

export default SubscriptionPrice;
