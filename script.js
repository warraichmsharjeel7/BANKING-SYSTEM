let currentOperation = '';
const bankId = 'MIK-2024';

function enterSystem() {
    document.getElementById('welcomePage').classList.add('hidden');
    document.getElementById('mainSystem').classList.remove('hidden');
}

function goToWelcome() {
    document.getElementById('welcomePage').classList.remove('hidden');
    document.getElementById('mainSystem').classList.add('hidden');
}

function showOperation(operation) {
    currentOperation = operation;
    document.getElementById('mainMenu').classList.add('hidden');
    document.getElementById('operationForm').classList.remove('hidden');
    document.getElementById('receipt').classList.add('hidden');
    document.getElementById('errorMessage').classList.add('hidden');

    // Reset form
    document.getElementById('bankForm').reset();

    // Configure form based on operation
    const depositSection = document.getElementById('depositSection');
    const withdrawSection = document.getElementById('withdrawSection');
    const operationTitle = document.getElementById('operationTitle');

    depositSection.classList.add('hidden');
    withdrawSection.classList.add('hidden');

    switch(operation) {
        case 'deposit':
            operationTitle.textContent = '💰 Deposit Money';
            depositSection.classList.remove('hidden');
            document.getElementById('depositAmount').required = true;
            break;
        case 'withdraw':
            operationTitle.textContent = '💳 Withdraw Money';
            withdrawSection.classList.remove('hidden');
            document.getElementById('withdrawAmount').required = true;
            break;
        case 'both':
            operationTitle.textContent = '🔄 Deposit and Withdraw';
            depositSection.classList.remove('hidden');
            withdrawSection.classList.remove('hidden');
            document.getElementById('depositAmount').required = true;
            document.getElementById('withdrawAmount').required = true;
            break;
    }
}

function showMainMenu() {
    document.getElementById('mainMenu').classList.remove('hidden');
    document.getElementById('operationForm').classList.add('hidden');
    document.getElementById('receipt').classList.add('hidden');
    document.getElementById('errorMessage').classList.add('hidden');
    document.getElementById('loanPlans').classList.add('hidden');
    document.getElementById('loanCalculator').classList.add('hidden');
}

function showLoanCalculator() {
    document.getElementById('mainMenu').classList.add('hidden');
    document.getElementById('operationForm').classList.add('hidden');
    document.getElementById('receipt').classList.add('hidden');
    document.getElementById('errorMessage').classList.add('hidden');
    document.getElementById('loanPlans').classList.add('hidden');
    document.getElementById('loanCalculator').classList.remove('hidden');
}

function calculateLoan() {
    const principal = parseFloat(document.getElementById('loanAmount').value);
    const annualRate = parseFloat(document.getElementById('interestRate').value);
    const years = parseFloat(document.getElementById('loanTerm').value);

    if (!principal || !annualRate || !years) {
        showError('Please fill in all calculator fields with valid numbers.');
        return;
    }

    // Convert annual rate to monthly rate
    const monthlyRate = (annualRate / 100) / 12;
    const numberOfPayments = years * 12;

    // Calculate monthly payment using loan formula
    const monthlyPayment = principal * (monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) / 
                         (Math.pow(1 + monthlyRate, numberOfPayments) - 1);

    const totalAmount = monthlyPayment * numberOfPayments;
    const totalInterest = totalAmount - principal;

    // Display results
    document.getElementById('monthlyPayment').textContent = '$' + monthlyPayment.toFixed(2);
    document.getElementById('totalAmount').textContent = '$' + totalAmount.toFixed(2);
    document.getElementById('totalInterest').textContent = '$' + totalInterest.toFixed(2);
    document.getElementById('calculatorResults').classList.remove('hidden');
}

function showLoanPlans() {
    document.getElementById('mainMenu').classList.add('hidden');
    document.getElementById('operationForm').classList.add('hidden');
    document.getElementById('receipt').classList.add('hidden');
    document.getElementById('errorMessage').classList.add('hidden');
    document.getElementById('loanPlans').classList.remove('hidden');
    document.getElementById('loanCalculator').classList.add('hidden');
}

function applyLoan(loanType) {
    alert(`Thank you for your interest in ${loanType}!\n\nThis is a demo system. In a real banking application, this would redirect you to a loan application form.\n\nFor actual loan applications, please visit our nearest branch or contact us at 0321-232323.`);
}

function processTransaction(event) {
    event.preventDefault();
    
    const currentAmount = parseFloat(document.getElementById('currentAmount').value);
    const depositAmount = parseFloat(document.getElementById('depositAmount').value) || 0;
    const withdrawAmount = parseFloat(document.getElementById('withdrawAmount').value) || 0;
    const branchNumber = document.getElementById('branchNumber').value || 'Main Branch';

    let finalAmount = currentAmount;
    let isValid = true;
    let errorMsg = '';

    // Validate and calculate based on operation
    switch(currentOperation) {
        case 'deposit':
            if (currentAmount < 0 || depositAmount <= 0) {
                isValid = false;
                errorMsg = 'Invalid amounts! Current amount must be non-negative and deposit amount must be positive.';
            } else {
                finalAmount = currentAmount + depositAmount;
            }
            break;
        
        case 'withdraw':
            if (currentAmount <= 0 || withdrawAmount <= 0) {
                isValid = false;
                errorMsg = 'Invalid amounts! Both amounts must be positive.';
            } else if (currentAmount < withdrawAmount) {
                isValid = false;
                errorMsg = 'Insufficient funds! You cannot withdraw more than your current balance.';
            } else {
                finalAmount = currentAmount - withdrawAmount;
            }
            break;
        
        case 'both':
            if (currentAmount < 0 || depositAmount <= 0 || withdrawAmount <= 0) {
                isValid = false;
                errorMsg = 'Invalid amounts! All amounts must be positive.';
            } else {
                const tempAmount = currentAmount + depositAmount;
                if (tempAmount < withdrawAmount) {
                    isValid = false;
                    errorMsg = 'Insufficient funds! Even after deposit, you cannot withdraw the requested amount.';
                } else {
                    finalAmount = tempAmount - withdrawAmount;
                }
            }
            break;
    }

    if (!isValid) {
        showError(errorMsg);
        return;
    }

    // Generate receipt
    generateReceipt(currentAmount, depositAmount, withdrawAmount, finalAmount, branchNumber);
}

function generateReceipt(currentAmount, depositAmount, withdrawAmount, finalAmount, branchNumber) {
    receiptData = {
        currentAmount: currentAmount,
        depositAmount: depositAmount,
        withdrawAmount: withdrawAmount,
        finalAmount: finalAmount,
        branchNumber: branchNumber
    };

    const now = new Date();
    const dateTime = now.toLocaleString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });

    let receiptHTML = `
        <div class="grid grid-cols-2 gap-3 text-xs sm:text-sm">
            <div><strong>Previous Balance:</strong></div>
            <div>$${currentAmount.toFixed(2)}</div>
    `;

    if (depositAmount > 0) {
        receiptHTML += `
            <div><strong>💰 Deposit:</strong></div>
            <div class="text-emerald-600 font-semibold">+$${depositAmount.toFixed(2)}</div>
        `;
    }

    if (withdrawAmount > 0) {
        receiptHTML += `
            <div><strong>💳 Withdrawal:</strong></div>
            <div class="text-rose-600 font-semibold">-$${withdrawAmount.toFixed(2)}</div>
        `;
    }

    receiptHTML += `
            <div class="border-t pt-2"><strong>💼 Final Balance:</strong></div>
            <div class="border-t pt-2 text-base font-bold text-sky-600">$${finalAmount.toFixed(2)}</div>
            <div><strong>🏢 Branch:</strong></div>
            <div>${branchNumber}</div>
            <div><strong>🆔 Bank ID:</strong></div>
            <div>${bankId}</div>
            <div><strong>📅 Date & Time:</strong></div>
            <div>${dateTime}</div>
        </div>
    `;

    document.getElementById('receiptContent').innerHTML = receiptHTML;
    document.getElementById('operationForm').classList.add('hidden');
    document.getElementById('receipt').classList.remove('hidden');
}

function showError(message) {
    document.getElementById('errorText').textContent = message;
    document.getElementById('errorMessage').classList.remove('hidden');
    setTimeout(() => {
        document.getElementById('errorMessage').classList.add('hidden');
    }, 5000);
}

function printReceipt() {
    const receiptContent = document.getElementById('receipt').innerHTML;
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
        <html>
            <head>
                <title>Bank Receipt</title>
                <style>
                    body { font-family: Arial, sans-serif; margin: 20px; }
                    .receipt-paper { background: #f8f9fa; padding: 20px; border: 2px dashed #ccc; }
                </style>
            </head>
            <body>${receiptContent}</body>
        </html>
    `);
    printWindow.document.close();
    printWindow.print();
}

let receiptData = {};

function downloadReceipt() {
    if (!receiptData.currentAmount) {
        showError('No receipt data available. Please complete a transaction first.');
        return;
    }

    const now = new Date();
    const dateTime = now.toLocaleString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });

    const transactionRef = 'TXN' + Date.now().toString().slice(-8);
    const receiptNo = 'RCP' + Math.random().toString(36).substr(2, 6).toUpperCase();

    const receiptHTML = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Bank Transaction Receipt</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap');
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Roboto', Arial, sans-serif; background: #f5f5f5; padding: 20px; color: #333; line-height: 1.4; }
        .receipt-container { max-width: 600px; margin: 0 auto; background: white; border: 2px solid #2c5aa0; border-radius: 8px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.1); }
        .header { background: linear-gradient(135deg, #2c5aa0 0%, #1e3d6f 100%); color: white; padding: 25px; text-align: center; position: relative; }
        .bank-logo { font-size: 32px; font-weight: 700; margin-bottom: 5px; letter-spacing: 2px; }
        .bank-subtitle { font-size: 14px; opacity: 0.9; font-weight: 300; }
        .receipt-title { background: #f8f9fa; padding: 15px; text-align: center; border-bottom: 2px dashed #ddd; font-size: 18px; font-weight: 600; color: #2c5aa0; }
        .receipt-info { display: flex; justify-content: space-between; padding: 15px 25px; background: #f1f3f4; font-size: 12px; border-bottom: 1px solid #ddd; }
        .transaction-details { padding: 25px; }
        .detail-row { display: flex; justify-content: space-between; align-items: center; padding: 12px 0; border-bottom: 1px solid #eee; }
        .detail-row:last-child { border-bottom: none; }
        .detail-label { font-weight: 500; color: #555; flex: 1; }
        .detail-value { font-weight: 600; color: #333; text-align: right; flex: 1; }
        .amount-positive { color: #28a745; }
        .amount-negative { color: #dc3545; }
        .final-balance { background: linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%); padding: 15px; margin: 15px 0; border-radius: 8px; border-left: 4px solid #2c5aa0; }
        .final-balance .detail-value { font-size: 20px; font-weight: 700; color: #2c5aa0; }
        .bank-info { background: #f8f9fa; padding: 20px 25px; border-top: 2px dashed #ddd; }
        .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 15px; }
        .info-item { display: flex; flex-direction: column; }
        .info-label { font-size: 11px; color: #666; text-transform: uppercase; font-weight: 500; margin-bottom: 3px; }
        .info-value { font-size: 13px; font-weight: 600; color: #333; }
        .footer { background: #2c5aa0; color: white; padding: 20px; text-align: center; }
        .footer-message { font-size: 14px; margin-bottom: 10px; }
        .contact-info { font-size: 12px; opacity: 0.9; }
        .security-features { padding: 15px 25px; background: #fff3cd; border: 1px solid #ffeaa7; font-size: 11px; color: #856404; text-align: center; }
    </style>
</head>
<body>
    <div class="receipt-container">
        <div class="header">
            <div class="bank-logo">🏦 MEEZAN BANK</div>
            <div class="bank-subtitle">Islamic Banking • Trusted Since 1997</div>
        </div>
        <div class="receipt-title">TRANSACTION RECEIPT</div>
        <div class="receipt-info">
            <div><strong>Receipt No:</strong> ${receiptNo}<br><strong>Transaction Ref:</strong> ${transactionRef}</div>
            <div style="text-align: right;"><strong>Date:</strong> ${dateTime.split(',')[0]}<br><strong>Time:</strong> ${dateTime.split(',')[1]}</div>
        </div>
        <div class="transaction-details">
            <div class="detail-row"><div class="detail-label">Account Balance (Before)</div><div class="detail-value">$${receiptData.currentAmount.toFixed(2)}</div></div>
            ${receiptData.depositAmount > 0 ? `<div class="detail-row"><div class="detail-label">💰 Deposit Amount</div><div class="detail-value amount-positive">+$${receiptData.depositAmount.toFixed(2)}</div></div>` : ''}
            ${receiptData.withdrawAmount > 0 ? `<div class="detail-row"><div class="detail-label">💳 Withdrawal Amount</div><div class="detail-value amount-negative">-$${receiptData.withdrawAmount.toFixed(2)}</div></div>` : ''}
            <div class="final-balance"><div class="detail-row"><div class="detail-label">💼 Current Account Balance</div><div class="detail-value">$${receiptData.finalAmount.toFixed(2)}</div></div></div>
        </div>
        <div class="bank-info">
            <div class="info-grid">
                <div class="info-item"><div class="info-label">Branch Name</div><div class="info-value">${receiptData.branchNumber}</div></div>
                <div class="info-item"><div class="info-label">Bank ID</div><div class="info-value">${bankId}</div></div>
                <div class="info-item"><div class="info-label">City</div><div class="info-value">Karachi, Pakistan</div></div>
                <div class="info-item"><div class="info-label">Contact</div><div class="info-value">0321-232323</div>
            </div></div>
            <div class="security-features">🔒 This is a computer generated receipt. No signature required.</div>
        </div>
        <div class="footer">
            <div class="footer-message">Thank you for choosing Meezan Bank</div>
            <div class="contact-info">Visit us: www.meezanbank.com | Support: 111-331-331</div>
        </div>
    </div>
</body>
</html>`;

    try {
        const blob = new Blob([receiptHTML], { type: 'text/html;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = `Meezan_Bank_Receipt_${receiptNo}_${Date.now()}.html`;
        document.body.appendChild(a);
        a.click();
        setTimeout(() => {
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        }, 100);
        showError('Professional receipt downloaded successfully!');
        setTimeout(() => {
            document.getElementById('errorMessage').classList.add('hidden');
        }, 3000);
    } catch (error) {
        showError('Download failed. Please try again.');
    }
}