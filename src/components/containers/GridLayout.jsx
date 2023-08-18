import React from 'react';

function GridLayout({ children }) {
	return <div className="flex flex-col md:grid md:grid-cols-6 2k:grid-cols-8 gap-4 xl:gap-20 2k:gap-32 w-full mt-20 xl:mt-24 2k:mt-32 relative">{children}</div>;
}

export default GridLayout;
