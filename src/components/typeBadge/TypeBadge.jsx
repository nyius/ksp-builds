import React from 'react';

function TypeBadge({ type }) {
	// if you're wondering why this chaos is here... it's because i originally had each badge with a unique color, but changed it to all be the same and couldn't be bothered to change it
	switch (type) {
		case 'Interplanetary':
			return <div className="badge bg-base-600 p-3">{type}</div>;
		case 'Interstellar':
			return <div className="badge bg-base-600 p-3">{type}</div>;
		case 'Satellite':
			return <div className="badge bg-base-600 p-3">{type}</div>;
		case 'Space Station':
			return <div className="badge bg-base-600 p-3">{type}</div>;
		case 'Lander':
			return <div className="badge bg-base-600 p-3">{type}</div>;
		case 'Rover':
			return <div className="badge bg-base-600 p-3">{type}</div>;
		case 'SSTO':
			return <div className="badge bg-base-600 p-3">{type}</div>;
		case 'Spaceplane':
			return <div className="badge bg-base-600 p-3">{type}</div>;
		case 'Probe':
			return <div className="badge bg-base-600 p-3">{type}</div>;
		case 'interplanetary':
			return <div className="badge bg-base-600 p-3">{type}</div>;
		case 'interstellar':
			return <div className="badge bg-base-600 p-3">{type}</div>;
		case 'satellite':
			return <div className="badge bg-base-600 p-3">{type}</div>;
		case 'space Station':
			return <div className="badge bg-base-600 p-3">{type}</div>;
		case 'lander':
			return <div className="badge bg-base-600 p-3">{type}</div>;
		case 'rover':
			return <div className="badge bg-base-600 p-3">{type}</div>;
		case 'ssto':
			return <div className="badge bg-base-600 p-3">{type}</div>;
		case 'spaceplane':
			return <div className="badge bg-base-600 p-3">{type}</div>;
		case 'probe':
			return <div className="badge bg-base-600 p-3">{type}</div>;
		default:
			return <div className="badge bg-base-600 p-3">{type}</div>;
	}
}

export default TypeBadge;
