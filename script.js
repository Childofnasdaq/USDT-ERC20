async function fetchTransactions() {
    const response = await fetch('/transactions');
    const data = await response.json();
    const transactionList = document.getElementById('transaction-list');

    transactionList.innerHTML = ''; // Clear previous entries
    data.forEach(tx => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${tx.type}</td>
            <td>${tx.amount}</td>
            <td>${tx.to}</td>
            <td><a href="https://etherscan.io/tx/${tx.txHash}" target="_blank">${tx.txHash}</a></td>
        `;
        transactionList.appendChild(row);
    });

    document.getElementById('status').textContent = "Connected";
}

setInterval(fetchTransactions, 5000); // Refresh every 5 seconds
fetchTransactions();
