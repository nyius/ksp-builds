import { S3Client } from '@aws-sdk/client-s3';

export const s3Client = new S3Client({
	apiVersion: 'latest',
	region: 'us-east-1',
	credentials: {
		accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY_ID,
		secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY,
	},
});
