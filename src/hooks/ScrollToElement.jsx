import { useEffect } from 'react';
import { scrollToElement } from '../utilities/scrollToElement';

/**
 * Handles scrolling to the bottom of a conversation when ever a user switches to a new convo
 * @param {*} ref - the react element reference to scroll to
 * @param {arr} listeners - an optional array of items to listen for in a use effect (for when to scroll)
 */
export const useScrollToElement = (ref, listeners = []) => {
	useEffect(() => {
		scrollToElement(ref);
	}, [...listeners, ref]);
};
