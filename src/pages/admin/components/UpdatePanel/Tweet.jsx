import React from 'react';

function Tweet() {
	/**
	 * handles verifying my account to make tweets
	 */
	const verifyTwitter = async () => {
		try {
			axios
				.post('https://us-central1-kspbuilds.cloudfunctions.net/startTwitterVerify', {})
				.then(res => {
					console.log(res);
				})
				.catch(err => console.error(err));
		} catch (error) {
			console.log(error);
		}
	};

	/**
	 * handles tweeting
	 */
	const tweet = async () => {
		try {
			axios
				.post('https://us-central1-kspbuilds.cloudfunctions.net/postTweet', { tweet: 'hello from my app!' }, {})
				.then(res => {
					console.log(res);
				})
				.catch(err => console.error(err));
		} catch (error) {
			console.log(error);
		}
	};

	return <div>Tweet</div>;
}

export default Tweet;
