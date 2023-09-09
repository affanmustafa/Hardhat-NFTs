// require('dotenv/config');
// require('@nomiclabs/hardhat-ethers');
// require('@nomiclabs/hardhat-etherscan');
// require('hardhat-gas-reporter');
// require('solidity-coverage');
// require('hardhat-deploy');
// require('@nomicfoundation/hardhat-chai-matchers');
// /** @type import('hardhat/config').HardhatUserConfig */

// const SEPOLIA_RPC_URL = process.env.SEPOLIA_RPC_URL;
// const PRIVATE_KEY = process.env.PRIVATE_KEY;
// const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY;
// const COINMARKETCAP_API_KEY = process.env.COINMARKETCAP_API_KEY;
// const MAINNET_RPC_URL = process.env.MAINNET_RPC_URL;

// module.exports = {
// 	//solidity: "0.8.8",
// 	solidity: {
// 		compilers: [
// 			{ version: '0.8.7' },
// 			{ version: '0.6.6' },
// 			{ version: '0.4.19' },
// 			{ version: '0.6.12' },
// 			{ version: '0.6.0' },
// 		],
// 	},
// 	defaultNetwork: 'hardhat',
// 	networks: {
// 		hardhat: {
// 			chainId: 31337,
// 			forking: {
// 				url: MAINNET_RPC_URL,
// 			},
// 		},
// 		sepolia: {
// 			url: SEPOLIA_RPC_URL,
// 			accounts: [PRIVATE_KEY],
// 			chainId: 11155111,
// 			gasPrice: 3500000,
// 			blockConfirmations: 6,
// 		},
// 		localhost: {
// 			url: 'http://127.0.0.1:8545/',
// 			chainId: 31337,
// 		},
// 	},
// 	etherscan: {
// 		apiKey: ETHERSCAN_API_KEY,
// 	},
// 	namedAccounts: {
// 		deployer: {
// 			default: 0,
// 		},
// 		users: {
// 			default: 1,
// 		},
// 	},
// 	gasReporter: {
// 		enabled: false,
// 		outputFile: 'gas-report.txt',
// 		noColors: true,
// 		currency: 'USD',
// 		coinmarketcap: COINMARKETCAP_API_KEY,
// 	},
// };

require('@nomiclabs/hardhat-waffle');
require('hardhat-gas-reporter');
require('@nomiclabs/hardhat-etherscan');
require('dotenv').config();
require('solidity-coverage');
require('hardhat-deploy');
// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more
/**
 * @type import('hardhat/config').HardhatUserConfig
 */

const COINMARKETCAP_API_KEY = process.env.COINMARKETCAP_API_KEY || '';
const SEPOLIA_RPC_URL =
	process.env.SEPOLIA_RPC_URL ||
	'https://eth-sepolia.g.alchemy.com/v2/YOUR-API-KEY';
const PRIVATE_KEY = process.env.PRIVATE_KEY || '';
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY || '';

module.exports = {
	defaultNetwork: 'hardhat',
	networks: {
		hardhat: {
			chainId: 31337,
			// gasPrice: 130000000000,
		},
		sepolia: {
			url: SEPOLIA_RPC_URL,
			accounts: [PRIVATE_KEY],
			chainId: 11155111,
			blockConfirmations: 6,
		},
		mainnet: {
			url: process.env.MAINNET_RPC_URL,
			accounts: [PRIVATE_KEY],
			chainId: 1,
			blockConfirmations: 6,
		},
	},
	solidity: {
		compilers: [
			{
				version: '0.8.8',
			},
			{
				version: '0.6.6',
			},
		],
	},
	etherscan: {
		apiKey: ETHERSCAN_API_KEY,
	},
	gasReporter: {
		enabled: true,
		currency: 'USD',
		outputFile: 'gas-report.txt',
		noColors: true,
		// coinmarketcap: COINMARKETCAP_API_KEY,
	},
	namedAccounts: {
		deployer: {
			default: 0, // here this will by default take the first account as deployer
			1: 0, // similarly on mainnet it will take the first account as deployer. Note though that depending on how hardhat network are configured, the account 0 on one network can be different than on another
		},
	},
	mocha: {
		timeout: 200000, // 200 seconds max for running tests
	},
};
