import React from 'react';
import { Helmet } from 'react-helmet';

/**
 * Helmet Component. Displays Text in the browser tab
 * @param {string} title - the text on the tab - looks like "KSP Builds - yourPageTitle"
 * @param {string} pageLink - the url of the current page
 * @param {string} description - The description of the page
 * @returns
 */
function HelmetHeader({ title, pageLink, description }) {
	return (
		<Helmet key={title}>
			<meta charSet="utf-8" />
			<title>KSP Builds - {title}</title>
			<link rel="canonical" href={pageLink} />
			<meta name="description" content={description ? description : 'A Hub to share and explore Kerbal Space Program 2 Builds'} />
		</Helmet>
	);
}

export default HelmetHeader;
