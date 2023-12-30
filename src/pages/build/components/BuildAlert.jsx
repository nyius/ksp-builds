import React from 'react';
import { IoIosAlert, IoIosWarning } from 'react-icons/io';

const getIcon = icon => {
	switch (icon) {
		case 'alert':
			return <IoIosAlert />;
		case 'warning':
			return <IoIosWarning />;
		default:
			return '';
	}
};

const getColor = color => {
	switch (color) {
		case 'red':
			return 'bg-error';
		case 'yellow':
			return 'bg-yellow-600';
		case 'green':
			return 'bg-success';
		case 'primary':
			return 'bg-primary';
		case 'secondary':
			return 'bg-secondary';
		case 'accent':
			return 'bg-accent';
		default:
			return 'bg-yellow-600';
	}
};

function BuildAlert({ text, color, css, icon }) {
	return (
		<div className={`w-full font-bold h-fit ${color === 'green' ? 'text-slate-800' : 'text-white'} rounded-xl px-4 2k:px-8 py-4 2k:py-8 ${css ? css : ''} ${color ? getColor(color) : 'bg-yellow-600'} text-xl 2k:text-3xl text-center `}>
			<div className="relative w-full h-full flex flex-row items-center justify-center gap-2 px-20">
				{icon ? <span className="text-3xl 2k:text-4xl">{getIcon(icon)}</span> : ''}
				{text}
			</div>
		</div>
	);
}

export default BuildAlert;
