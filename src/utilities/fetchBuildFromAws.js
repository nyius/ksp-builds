import { decompressFromEncodedURIComponent } from 'lz-string';
import { s3Client } from '../S3.config';
import { GetObjectCommand } from '@aws-sdk/client-s3';
import { auth } from '../firebase.config';
import errorReport from './errorReport';

/**
 * Handles fetching a raw build from AWS. Takes in an id
 * @param {*} id
 * @returns build json
 */
const fetchBuildFromAWS = async id => {
	let response, rawBuildData, parsedBuild;

	// Get the raw build from aws
	try {
		const command = new GetObjectCommand({
			Bucket: process.env.REACT_APP_BUCKET,
			Key: `${id}.json`,
		});

		response = await s3Client.send(command);
		rawBuildData = await response.Body.transformToString();

		// If we have an older uncompressed buildFile
		if (rawBuildData.includes('AssemblyOABConfig')) {
			parsedBuild = JSON.parse(rawBuildData);
		} else {
			const decompress = decompressFromEncodedURIComponent(rawBuildData);
			parsedBuild = JSON.parse(decompress);
		}
	} catch (error) {
		errorReport(error.message, true, 'fetchBuildFromAWS', auth?.currentUser ? auth.currentUser : null);
	}

	return parsedBuild;
};

export default fetchBuildFromAWS;
