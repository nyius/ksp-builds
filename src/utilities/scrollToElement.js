/**
 * Scrolls the screen to an element
 * @param {*} element - a react element reference (from useRef)
 */
export const scrollToElement = element => {
	element.current?.scrollIntoView();
};
