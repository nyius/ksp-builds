module.exports = {
	content: ['./src/**/*.{html,js,jsx}'],
	theme: {
		extend: {
			screens: {
				'2k': '1921px',
			},
		},
	},
	plugins: [require('daisyui')],
};
