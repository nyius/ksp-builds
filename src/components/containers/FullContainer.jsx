import React from 'react';

function FullContainer({ children }) {
	return <div className="main-container flex w-full justify-center mb-6 min-h-screen">{children}</div>;
}

export default FullContainer;
