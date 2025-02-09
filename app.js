const axios = require('axios'); // Add this line for API calls

// Send ETH
async function sendETH(amount) {
    const balance = await checkETHBalance();
    if (parseFloat(balance) < parseFloat(process.env.GAS_THRESHOLD)) {
        console.log('Not enough ETH for gas.');
        return;
    }
    const tx = {
        from: senderAddress,
        to: process.env.ETH_RECEIVER_ADDRESS,
        value: web3.utils.toWei(amount.toString(), 'ether'),
        gas: 21000,
        gasPrice: await web3.eth.getGasPrice(),
    };
    const signedTx = await web3.eth.accounts.signTransaction(tx, senderPrivateKey);
    const receipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);

    console.log(`ETH Sent: ${receipt.transactionHash}`);

    // Log transaction in backend
    axios.post('http://localhost:3000/transactions/add', {
        type: 'ETH',
        amount,
        to: process.env.ETH_RECEIVER_ADDRESS,
        txHash: receipt.transactionHash
    });
}

// Send USDT
async function sendUSDT(amount) {
    const wallet = new ethers.Wallet(senderPrivateKey, provider);
    const contractWithSigner = usdtContract.connect(wallet);
    const tx = await contractWithSigner.transfer(process.env.USDT_RECEIVER_ADDRESS, ethers.utils.parseUnits(amount.toString(), 6));
    await tx.wait();

    console.log(`USDT Sent: ${tx.hash}`);

    // Log transaction in backend
    axios.post('http://localhost:3000/transactions/add', {
        type: 'USDT',
        amount,
        to: process.env.USDT_RECEIVER_ADDRESS,
        txHash: tx.hash
    });
}
