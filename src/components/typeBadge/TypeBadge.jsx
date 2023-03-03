import React from 'react';

function TypeBadge({ type }) {
	switch (type) {
		case 'Interplanetary':
			return <div className="absolute top-2 left-2 badge badge-primary">{type}</div>;
		case 'Interstellar':
			return <div className="absolute top-2 left-2 badge badge-secondary">{type}</div>;
		case 'Satellite':
			return <div className="absolute top-2 left-2 badge badge-accent">{type}</div>;
		case 'Space Station':
			return <div className="absolute top-2 left-2 badge badge-info">{type}</div>;
		case 'Lander':
			return <div className="absolute top-2 left-2 badge badge-success">{type}</div>;
		case 'Rover':
			return <div className="absolute top-2 left-2 badge badge-warning">{type}</div>;
		case 'SSTO':
			return <div className="absolute top-2 left-2 badge badge-error">{type}</div>;
		case 'Spaceplane':
			return <div className="absolute top-2 left-2 badge badge-spaceplane">{type}</div>;
		case 'Probe':
			return <div className="absolute top-2 left-2 badge badge-probe">{type}</div>;
		case 'interplanetary':
			return <div className="absolute top-2 left-2 badge badge-primary">{type}</div>;
		case 'interstellar':
			return <div className="absolute top-2 left-2 badge badge-secondary">{type}</div>;
		case 'satellite':
			return <div className="absolute top-2 left-2 badge badge-accent">{type}</div>;
		case 'space Station':
			return <div className="absolute top-2 left-2 badge badge-info">{type}</div>;
		case 'lander':
			return <div className="absolute top-2 left-2 badge badge-success">{type}</div>;
		case 'rover':
			return <div className="absolute top-2 left-2 badge badge-warning">{type}</div>;
		case 'ssto':
			return <div className="absolute top-2 left-2 badge badge-error">{type}</div>;
		case 'spaceplane':
			return <div className="absolute top-2 left-2 badge badge-spaceplane">{type}</div>;
		case 'probe':
			return <div className="absolute top-2 left-2 badge badge-probe">{type}</div>;
		default:
			return <div className="absolute top-2 left-2 badge badge-info">{type}</div>;
	}
}

export default TypeBadge;
