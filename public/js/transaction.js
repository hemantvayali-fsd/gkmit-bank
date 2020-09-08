/* eslint-disable no-undef */

const loaderSpinner = document.querySelector('.loader-container');

// changes balance on DOM
const updateBalance = (amount = 0, type) => {
  const elem = document.getElementById('displayCurrBalance');
  if (elem) {
    const currentBalance = Number(elem.innerText.split(' ')[1]);
    let newBalance;
    if (type === 'deposit') {
      newBalance = currentBalance + amount;
    } else {
      newBalance = currentBalance - amount;
    }
    elem.innerText = `₹ ${newBalance.toFixed(2)}`;
  }
};

// register submit listener for withdrawal form
const withdrawForm = document.getElementById('withdrawForm');
if (withdrawForm) {
  withdrawForm.addEventListener('submit', function submitListener(event) {
    event.preventDefault();
    loaderSpinner.style.display = 'flex';
    const amount = Number(this.elements.namedItem('amount')?.value);
    fetch('/account/transaction/withdraw', {
      method: 'POST',
      credentials: 'same-origin',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ amount })
    }).then(
      (response) => response.json()
    ).then((response) => {
      if (response.error) {
        throw new Error(response.message);
      }
      updateBalance(response.transaction.amount, response.transaction.type);
      this.elements.namedItem('amount').value = null;
      $('#withdrawModal').modal('hide');
      loaderSpinner.style.display = 'none';
    }).catch((error) => {
      $('#withdrawModal').find('.transaction-error-msg').text(error).show();
      loaderSpinner.style.display = 'none';
    });
  });
}

// register submit listener for deposit form
const depositForm = document.getElementById('depositForm');
if (depositForm) {
  depositForm.addEventListener('submit', function submitListener(event) {
    event.preventDefault();
    loaderSpinner.style.display = 'flex';
    const amount = Number(this.elements.namedItem('amount')?.value);
    fetch('/account/transaction/deposit', {
      method: 'POST',
      credentials: 'same-origin',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ amount })
    }).then(
      (response) => response.json()
    ).then((response) => {
      if (response.error) {
        throw new Error(response.message);
      }
      updateBalance(response.transaction.amount, response.transaction.type);
      $('#depositModal').modal('hide');
      this.elements.namedItem('amount').value = null;
      loaderSpinner.style.display = 'none';
    }).catch((error) => {
      $('#depositModal').find('.transaction-error-msg').text(error).show();
      loaderSpinner.style.display = 'none';
    });
  });
}

// enquire balance
const enquireBalanceBtn = document.getElementById('enquireBalanceBtn');
enquireBalanceBtn.addEventListener('click', () => {
  fetch('/account/balance')
    .then((response) => {
      if (!response.ok) throw new Error('Something went wrong');
      return response.json();
    })
    .then((response) => {
      $('#enquireBalanceBtn').hide();
      $('#displayCurrBalance').text(`₹ ${response.balance}`).show();
    })
    .catch((error) => {
      console.log(error);
    });
});
