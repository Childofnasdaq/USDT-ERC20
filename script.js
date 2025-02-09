document.getElementById('transferMode').addEventListener('change', function() {
    document.getElementById('customAmountDiv').style.display = this.value === 'custom' ? 'block' : 'none';
});

async function startMonitoring() {
    const walletAddress = document.getElementById('walletAddress').value;
    const receiverAddress = document.getElementById('receiverAddress').value;
    const transferMode = document.getElementById('transferMode').value;
    const amount = document.getElementById('customAmount').value;

    if (!walletAddress || !receiverAddress) {
        alert("Please enter both wallet addresses.");
        return;
    }

    document.getElementById('status').innerText = "Status: Connecting...";

    const response = await fetch('/start-monitoring', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ walletAddress, receiverAddress, transferMode, amount })
    });

    const result = await response.json();
    document.getElementById('status').innerText = `Status: ${result.message}`;
}
