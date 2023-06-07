module.exports = {
	content: ['./src/**/*.{html,js,jsx}'],
	theme: {
		extend: {
			screens: {
				'2k': '1921px',
				'4k': '2561px',
				'5k': '3500px',
			},
			zIndex: {
				51: '51',
				110: '110',
			},
			minWidth: {
				12: '12rem',
			},
			maxWidth: {
				'1/4': '25%',
				'1/3': '33.333333%',
				'1/2': '50%',
			},
			aspectRatio: {
				'2/3': '2 / 3',
				'3/4': '3 / 4',
				'4/5': '4 / 5',
				'5/6': '5 / 6',
				'1/2': '1 / 2',
			},
			height: {
				22: '5.5rem',
				25: '6.25rem',
				26: '6.5rem',
				30: '7.5rem',
				102: '25.25rem',
				104: '25.75rem',
				106: '26.25rem',
				108: '26.75rem',
				112: '27.75rem',
				114: '28.25rem',
				116: '28.75rem',
				118: '29.25rem',
				120: '29.75rem',
				220: '54.75rem',
			},
			width: {
				13: '3.25rem',
				15: '3.75rem',
				17: '4.25rem',
				18: '4.5rem',
				22: '5.5rem',
				26: '6.5rem',
				30: '7.5rem',
				35: '8.75rem',
				45: '11.25rem',
				50: '12.5rem',
				58: '14.5rem',
				66: '16.5rem',
				99: '24.5rem',
				110: '27.25rem',
				120: '29.75rem',
				130: '32.25rem',
				150: '37.25rem',
				158: '39.25rem',
				160: '39.75rem',
				170: '42.25rem',
				180: '44.75rem',
				300: '75.75rem',
			},
			spacing: {
				39: '9.75rem',
				38: '9.5rem',
				37: '9.25rem',
			},
			minWidth: {
				'3/4': '75%',
				'1/2': '50%',
			},
		},
	},
	plugins: [require('daisyui')],
	daisyui: {
		themes: ['dark'],
	},
};
