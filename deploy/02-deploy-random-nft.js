const { network, ethers } = require('hardhat');
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

let tokenUris = [
	'ipfs://QmaVkBn2tKmjbhphU7eyztbvSQU5EXDdqRyXZtRhSGgJGo',
	'ipfs://QmYQC5aGZu2PTH8XzbJrbDnvhj3gVs7ya33H9mqUNvST3d',
	'ipfs://QmZYmH5iDbD6v3U2ixoVAjioSzvWJszDzYdbeCLquGSpVm',
];

const FUND_AMOUNT = '100000000000000000000'; // 10 LINK

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
		await vrfCoordinatorV2Mock.fundSubscription(subscriptionId, FUND_AMOUNT);
	} else {
		vrfCoordinatorV2Address = networkConfig[chainId].vrfCoordinatorV2;
		subscriptionId = networkConfig[chainId].subscriptionId;
	}

	log('-------------------------------------------------');
	await storeImages(imagesLocation);
	const args = [
		vrfCoordinatorV2Address,
		subscriptionId,
		networkConfig[chainId].gasLane,
		networkConfig[chainId].callbackGasLimit,
		tokenUris,
		networkConfig[chainId].mintFee,
	];

	const randomIpfsNft = await deploy('RandomIpfsNft', {
		from: deployer,
		args: args,
		log: true,
		waitConfirmations: network.config.blockConfirmations || 1,
	});
	log('-------------------------------------------------');
	if (
		!developmentChains.includes(network.name) &&
		process.env.ETHERSCAN_API_KEY
	) {
		log('Verifying...');
		await verify(randomIpfsNft.getAddress(), args);
	}
};

async function handleTokenUris() {
	tokenUris = [];
	const { responses: imageUploadResponses, files } =
		await storeImages(imagesLocation);
	for (let imageUploadResponseIndex in imageUploadResponses) {
		let tokenUriMetadata = { ...metaDataTemplate };
		tokenUriMetadata.name = files[imageUploadResponseIndex].replace('.png', '');
		tokenUriMetadata.description = `An adorable ${tokenUriMetadata.name} pup!`;
		tokenUriMetadata.image = `ipfs://${imageUploadResponses[imageUploadResponseIndex].IpfsHash}`;
		console.log(`Uploading ${tokenUriMetadata.name}...`);
		const metadataUploadResponse =
			await storeTokenUriMetadata(tokenUriMetadata);
		tokenUris.push(`ipfs://${metadataUploadResponse.IpfsHash}`);
	}
	console.log('Token URIs uploaded! They are:');
	console.log(tokenUris);
	return tokenUris;
}

module.exports.tags = ['all', 'randomipfs', 'main'];
