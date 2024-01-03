import React from 'react';

function HeroProgressBar({ progress, slideTimer }) {
	return (
		<div className="hero-card overflow-hidden">
			<div style={{ width: `${progress}%` }} className="bg-primary h-1 mb-5" />;
		</div>
	);
}

export default HeroProgressBar;
