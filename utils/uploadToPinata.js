const pinataSDK = require('@pinata/sdk');
const path = require('path');
const fs = require('fs');
require('dotenv').config();
const pinataApiKey = process.env.PINATA_API_KEY;
const pinataApiSecret = process.env.PINATA_API_SECRET;

const pinata = new pinataSDK(pinataApiKey, pinataApiSecret);

// async function storeImages(imagesFilePath) {
// 	const fullImagesPath = path.resolve(imagesFilePath);
// 	const files = fs.readdirSync(fullImagesPath);
// 	let responses = [];
// 	console.log('Uploading files to IPFS!');
// 	for (let fileIndex in files) {
// 		const readableStreamForFile = fs.createReadStream(
// 			`${fullImagesPath}/${files[fileIndex]}`
// 		);
// 		try {
// 			const response = await pinata.pinFileToIPFS(readableStreamForFile);
// 			responses.push(response);
// 		} catch (error) {
// 			console.error(error);
// 		}
// 	}
// 	console.log(files);
// 	return { responses, files };
// }
async function storeImages(imagesFilePath) {
	const fullImagesPath = path.resolve(imagesFilePath);
	const files = fs.readdirSync(fullImagesPath);
	let responses = [];
	for (fileIndex in files) {
		const readableStreamForFile = fs.createReadStream(
			`${fullImagesPath}/${files[fileIndex]}`
		);
		try {
			const response = await pinata.pinFileToIPFS(readableStreamForFile);
			responses.push(response);
		} catch (error) {
			console.log(error);
		}
	}
	return { responses, files };
}

async function storeTokenUriMetadata(metadata) {
	try {
		const response = await pinata.pinJSONToIPFS(metadata);
		return response;
	} catch (error) {
		console.error(error);
	}
}

module.exports = { storeImages, storeTokenUriMetadata };
