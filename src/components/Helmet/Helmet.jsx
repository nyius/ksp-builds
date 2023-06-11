import React from 'react';
import { Helmet } from 'react-helmet';

/**
 * Helmet Component. Displays Text in the browser tab
 * @param {string} title - the text on the tab - looks like "KSP Builds - yourPageTitle"
 * @param {string} pageLink - the url of the current page
 * @returns
 */
function HelmetHeader({ title, pageLink }) {
	return (
		<Helmet>
			<meta charSet="utf-8" />
			<title>KSP Builds - {title}</title>
			<link rel="canonical" href={pageLink} />
		</Helmet>
	);
}

export default HelmetHeader;
