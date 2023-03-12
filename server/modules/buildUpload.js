import { fileURLToPath } from 'url';
import { readdirSync, readFileSync, writeFile } from 'fs';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';

const buildUpload = function (id, build) {
	const region = 'us-east-2';
	const client = new S3Client({
		credentials: {
			accessKeyId: 'AKIA5QCJ5KNNUJUPEZ6J',
			secretAccessKey: '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',
		},
		region,
	});

	const buf = Buffer.from(build);

	var data = {
		Bucket: process.env.BUCKET,
		Key: `${id}.json`,
		Body: buf,
		ContentEncoding: 'base64',
		ContentType: 'application/json',
		ACL: 'public-read',
	};

	// client.upload(data, function (err, data) {
	// 	if (err) {
	// 		console.log(err);
	// 		console.log('Error uploading data: ', data);
	// 	} else {
	// 		console.log('succesfully uploaded!');
	// 	}
	// });

	const command = new PutObjectCommand({
		Bucket: process.env.S3_BUCKET,
		Key: `${id}.json`,
		Body: build,
	});

	const response = client.send(command);
};

export default buildUpload;
