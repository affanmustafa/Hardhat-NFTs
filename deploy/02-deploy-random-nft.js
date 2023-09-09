const { network } = require('hardhat');
const {
	developmentChains,
	networkConfig,
} = require('../helper-hardhat-config');
const { verify } = require('../utils/verify');
const {
	storeImages,
	storeTokenUriMetadata,
} = require('../utils/uploadToPinata');

const imagesLocation = './images/random';
let tokenUris;

const metaDataTemplate = {
	name: '',
	description: '',
	image: '',
	attributes: [
		{
			trait_type: 'Cuteness',
			value: 100,
		},
	],
};

module.exports = async function ({ getNamedAccounts, deployments }) {
	const { deploy, log } = deployments;
	const { deployer } = await getNamedAccounts();
	const chainId = network.config.chainId;

	//Get the IPFS Hash of our images

	if (process.env.UPLOAD_TO_PINATA == 'true') {
		tokenUris = await handleTokenUris();
	}
	// 1. With our own IPFS node
	// 2. Pinata pinata.cloud
	// 3. nft.storage

	let vrfCoordinatorV2Address, subscriptionId;
	if (developmentChains.includes(network.name)) {
		const vrfCoordinatorV2Mock = await ethers.getContract(
			'VRFCoordinatorV2Mock'
		);
		vrfCoordinatorV2Address = vrfCoordinatorV2Mock.target;
		const tx = await vrfCoordinatorV2Mock.createSubscription();
		const txReceipt = await tx.wait(1);
		//subscriptionId = txReceipt.events.args[0].subId;
		subscriptionId = 1;
	} else {
		vrfCoordinatorV2Address = networkConfig[chainId].vrfCoordinatorV2;
		subscriptionId = networkConfig[chainId].subscriptionId;
	}

	log('-------------------------------------------------');
	// await storeImages(imagesLocation);
	// const args = [
	// 	vrfCoordinatorV2Address,
	// 	subscriptionId,
	// 	networkConfig[chainId].gasLane,
	// 	networkConfig[chainId].callbackGasLimit,
	// 	// tokenURIs
	// 	networkConfig[chainId].mintFee,
	// ];
};

async function handleTokenUris() {
	tokenUris = [];
	// store the image in IPFS
	// store the metadata in IPFS
	const { reponses: imageUploadResponses, files } =
		await storeImages(imagesLocation);
	for (let imageUploadResponseIndex in imageUploadResponses) {
		let tokenUriMetadata = { ...metaDataTemplate };
		tokenUriMetadata.name = files[imageUploadResponseIndex].replace('.png', '');
		tokenUriMetadata.description = `An adorable ${tokenUriMetadata.name} pup!`;
		tokenUriMetadata.image = `ipfs://${imageUploadResponses[imageUploadResponseIndex].IpfsHash}`;
		console.log(`Uploading ${tokenUriMetadata.name}... `);
		//store the JSON to pinata / IPFS
		const metadataUploadResponse =
			await storeTokenUriMetadata(tokenUriMetadata);
		tokenUris.push(`ipfs://${metadataUploadResponse.IpfsHash}`);
	}
	console.log('Token URIs Uploaded! They are: ');
	console.log(tokenUris);
	return tokenUris;
}

module.exports.tags = ['all', 'randomipfs', 'main'];
