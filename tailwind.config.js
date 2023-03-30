module.exports = {
	content: ['./src/**/*.{html,js,jsx}'],
	theme: {
		extend: {
			screens: {
				'2k': '1921px',
				'4k': '2561px',
			},
			minWidth: {
				12: '12rem',
			},
			maxWidth: {
				'1/4': '25%',
				'1/3': '33.333333%',
				'1/2': '50%',
			},
			height: {
				102: '30rem',
			},
		},
	},
	plugins: [require('daisyui')],
	daisyui: {
		themes: ['dark'],
	},
};
