import React from 'react';

function CenterContainer({ children }) {
	return <div className="col-end-6 md:col-start-3 md:col-end-7 lg:col-start-2 xl:col-end-6 2k:col-end-8 grid md:mr-8 xl:mr-0">{children}</div>;
}

export default CenterContainer;
