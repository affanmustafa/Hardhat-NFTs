const { assert } = require('chai');
const { network, deployments, ethers } = require('hardhat');
const { developmentChains } = require('../../helper-hardhat-config');

!developmentChains.includes(network.name)
	? describe.skip
	: describe('BasicNft', async function () {
			let basicNft;
			let deployer;

			beforeEach(async () => {
				accounts = await ethers.getSigners();
				deployer = accounts[0];
				await deployments.fixture(['basicnft']);
				basicNft = await ethers.getContract('BasicNft', deployer);
			});

			describe('Constructor', () => {
				it('Calls the constructor to initialize the NFT', async function () {
					const name = await basicNft.name();
					const symbol = await basicNft.symbol();
					const tokenCounter = await basicNft.getTokenCounter();
					assert.equal(name, 'Dogie');
					assert.equal(symbol, 'DOG');
					assert.equal(tokenCounter.toString(), '0');
				});
			});
			describe('Minting NFT', () => {
				beforeEach(async () => {
					const txResponse = await basicNft.mintNft();
					txResponse.wait(1);
				});
				it('Allows users to mint NFT', async function () {
					const tokenURI = await basicNft.tokenURI(0);
					const tokenCounter = await basicNft.getTokenCounter();

					assert.equal(tokenCounter.toString(), '1');
					assert.equal(tokenURI, await basicNft.TOKEN_URI());
				});
				it('Should show the balance of owner of NFT', async function () {
					const deployerAddress = await deployer.getAddress();
					const deployerBalance = await basicNft.balanceOf(deployerAddress);
					const owner = await basicNft.ownerOf('0');

					assert.equal(deployerBalance.toString(), '1');
					assert.equal(owner, deployerAddress);
				});
			});
	  });
