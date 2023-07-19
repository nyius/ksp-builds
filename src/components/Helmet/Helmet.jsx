import React from 'react';
import { Helmet } from 'react-helmet';

/**
 * Helmet Component. Displays Text in the browser tab
 * @param {string} title - the text on the tab - looks like "KSP Builds - yourPageTitle"
 * @param {string} pageLink - the url of the current page
 * @param {string} description - The description of the page
 * @param {url} image - A image to use for the page
 * @returns
 */
function HelmetHeader({ title, pageLink, type, description, image }) {
	return (
		<Helmet key={title}>
			<meta charSet="utf-8" />
			<title>KSP Builds - {title}</title>
			<link rel="canonical" href={pageLink} />

			<meta property="og:title" content={title} />
			<meta property="og:type" content={type ? type : 'website'} />
			<meta property="og:image" content={image ? image : 'https://i.imgur.com/Tl08i9E.png'} />
			<meta property="og:url" content={pageLink} />
			<meta property="og:description" content={description ? description : 'A Hub to share and explore Kerbal Space Program 2 Builds'} />
			<meta property="og:site_name" content="KSP Builds" />
			<meta name="twitter:card" content="summary_large_image" />
			<meta name="twitter:site" content="@KSP_Builds" />

			<meta name="description" content={description ? description : 'A Hub to share and explore Kerbal Space Program 2 Builds'} />
		</Helmet>
	);
}

export default HelmetHeader;
