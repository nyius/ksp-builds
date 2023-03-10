module.exports = {
	content: ['./src/**/*.{html,js,jsx}'],
	theme: {
		extend: {
			screens: {
				'2k': '1921px',
				'4k': '2561px',
			},
		},
	},
	plugins: [require('daisyui')],
	daisyui: {
		themes: ['dark'],
	},
};
