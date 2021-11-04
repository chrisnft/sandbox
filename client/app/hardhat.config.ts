import "@nomiclabs/hardhat-ethers" // use hardhat-ethers for development
import "@nomiclabs/hardhat-waffle" // use hardhat-waffle for testing
import { task, HardhatUserConfig } from "hardhat/config"

task("accounts", "Prints the list of accounts", async (args, { ethers }) => {
	const accounts = await ethers.getSigners();
	for (const account of accounts) {
		console.log(account.address);
	}
});

task("balances", "Print balances of accounts", async (args, { ethers }) => {
	const accounts = await ethers.getSigners();
	for (const account of accounts) {
		const balance = await ethers.provider.getBalance(account.address);
		console.log(account.address, "has balance", balance.toString());
	}
});

const config: HardhatUserConfig = {
	defaultNetwork: "hardhat",
	networks: {
		local: {
			url: process.env.REMOTE_NODE_URL,
			chainId: 31337,
		},
	},
	solidity: {
		compilers: [
			{
				version: "0.5.16"
			},
			{
				version: "0.6.2"
			},
			{
				version: "0.6.4"
			},
			{
				version: "0.7.0"
			},
			{
				version: "0.8.0"
			}
		]
	},
};

export default config
