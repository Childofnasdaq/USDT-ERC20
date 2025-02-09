require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { ethers } = require('ethers');

const app = express();
app.use(express.json());
app.use(cors());

const PRIVATE_KEY = process.env.PRIVATE_KEY;
const INFURA_API_URL = process.env.INFURA_API_URL;
const USDT_CONTRACT_ADDRESS = "0xdAC17F958D2ee523a2206206994597C13D831ec7"; // USDT Mainnet

const provider = new ethers.JsonRpcProvider(INFURA_API_URL);
const wallet = new ethers.Wallet(PRIVATE_KEY, provider);
const usdtAbi = ["function balanceOf(address owner) view returns (uint256)", "function transfer(address to, uint256 amount) returns (bool)"];
const usdtContract = new ethers.Contract(USDT_CONTRACT_ADDRESS, usdtAbi, wallet);

async function getETHBalance(address) {
    const balance = await provider.getBalance(address);
    return ethers.formatEther(balance);
}

async function getUSDTBalance(address) {
    const balance = await usdtContract.balanceOf(address);
    return ethers.formatUnits(balance, 6);
}

async function sendUSDT(receiver, amount) {
    const tx = await usdtContract.transfer(receiver, ethers.parseUnits(amount.toString(), 6));
    await tx.wait();
    return tx.hash;
}

app.post('/start-monitoring', async (req, res) => {
    const { walletAddress, receiverAddress, transferMode, amount } = req.body;

    console.log(`Monitoring wallet: ${walletAddress}`);

    setInterval(async () => {
        try {
            const ethBalance = await getETHBalance(walletAddress);
            console.log(`ETH Balance: ${ethBalance}`);

            if (parseFloat(ethBalance) < 0.002) {
                console.log("Not enough ETH for gas.");
                return;
            }

            const usdtBalance = await getUSDTBalance(walletAddress);
            console.log(`USDT Balance: ${usdtBalance}`);

            if (parseFloat(usdtBalance) > 0) {
                let transferAmount = transferMode === 'custom' ? amount : usdtBalance;
                console.log(`Sending ${transferAmount} USDT to ${receiverAddress}...`);

                const txHash = await sendUSDT(receiverAddress, transferAmount);
                console.log(`Transaction Sent! Tx Hash: ${txHash}`);
            } else {
                console.log("No USDT available.");
            }
        } catch (error) {
            console.error("Error:", error);
        }
    }, 60000); // Runs every 60 seconds

    res.json({ message: "Monitoring started..." });
});

app.listen(3000, () => console.log("Server running on port 3000"));
