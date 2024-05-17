'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jéssica Karine',
  movements: [4000, 1400, -150, -1790, -810, -1000, 3500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const account5 = {
  owner: 'Bruno Cabral',
  movements: [50, 50, 200, 1000, 90, 600, 250, 260],
  interestRate: 1,
  pin: 5555,
};

const accounts = [account1, account2, account3, account4, account5];

const creatUserName = function (accs) {
  accs.forEach(function (mov) {
    mov.username = mov.owner
      .toLowerCase()
      .split(' ')
      .map(mov => mov[0])
      .join('');
  });
};

creatUserName(accounts);

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const balanceDate = document.querySelector('.date');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

const euroPraReal = 5.35;

const displayMovements = function (movements) {
  //Esvazia o html padrao
  containerMovements.innerHTML = '';

  movements.forEach(function (mov, index) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';

    const html = `
    <div class="movements__row">
      <div class="movements__type movements__type--${type}">${
      index + 1
    } ${type}</div>
      <div class="movements__value">${mov}€</div>
    </div>`;

    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

const calcBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, elem) => acc + elem, 0);
  labelBalance.textContent = `${acc.balance} €`;
};

const calcSummary = function (acc) {
  const deposit = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);

  labelSumIn.textContent = `${deposit}€`;

  const withdrawal = acc.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);

  labelSumOut.textContent = `${Math.abs(withdrawal)}€`;

  const interest = acc.movements
    .filter(mov => mov > 0)
    .map(mov => (mov * acc.interestRate) / 100)
    .filter(mov => mov >= 1)
    .reduce((acc, mov) => acc + mov, 0);

  labelSumInterest.textContent = `${interest}€`;
};

const updateUI = function (currentAccount) {
  displayMovements(currentAccount.movements);
  calcBalance(currentAccount);
  calcSummary(currentAccount);
};

const logOut = function () {
  let minuto = 10;
  let segs = 0;

  const interval = setInterval(() => {
    if (minuto === 0 && segs === 0) {
      //LogOut
      clearInterval(interval);
      containerApp.style.opacity = 0;
      labelWelcome.textContent = 'Log in to get started';
    } else {
      if (segs === 0) {
        minuto--;
        segs = 59;

        labelTimer.textContent = `${minuto.toString().padStart(2, '0')}:${segs
          .toString()
          .padStart(2, '0')}`;
      } else {
        segs--;
        labelTimer.textContent = `${minuto.toString().padStart(2, '0')}:${segs
          .toString()
          .padStart(2, '0')}`;
      }
    }

    labelTimer.textContent = time;
  }, 1000);
};

//LOGIN BUTTON
let currentAccount;

btnLogin.addEventListener('click', function (e) {
  //Nao envia o formulario
  e.preventDefault();

  //Acessando o usuario (objeto)
  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );

  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    labelWelcome.textContent = `Welcome Back, ${
      currentAccount.owner.split(' ')[0]
    }!`;

    //Manipulando o HTML
    containerApp.style.opacity = 100;

    //Limpando o form
    inputLoginUsername.value = inputLoginPin.value = '';

    //Tirar o foco do campo do pin
    inputLoginPin.blur();

    //Calculando Conta
    updateUI(currentAccount);

    //Data
    formatDate(new Date());

    //LogOut
    logOut();
  } else {
    labelWelcome.textContent = 'Incorrect username or password!';
  }
});

//TRANSFER BUTTON

btnTransfer.addEventListener('click', function (e) {
  //Nao envia o formulario
  e.preventDefault();

  const amount = Number(inputTransferAmount.value);
  const receiveAcc = accounts.find(
    acc => acc.username === inputTransferTo.value
  );

  if (
    amount > 0 &&
    currentAccount.balance >= amount &&
    receiveAcc &&
    receiveAcc?.username != currentAccount.username
  ) {
    currentAccount.movements.push(-amount);
    receiveAcc.movements.push(amount);

    //Calculando Conta
    updateUI(currentAccount);
  }

  inputTransferAmount.value = inputTransferTo.value = '';
});

//LOAN BUTTON

btnLoan.addEventListener('click', function (e) {
  //Nao envia o formulario
  e.preventDefault();

  const amount = Number(inputLoanAmount.value);

  if (amount > 0 && currentAccount.movements.some(mov => mov >= 0.1 * amount)) {
    setTimeout(() => {
      currentAccount.movements.push(amount);
      updateUI(currentAccount);
    }, 10000);
  }

  inputLoanAmount.value = '';
});

//DELETE BUTTON

btnClose.addEventListener('click', function (e) {
  //Nao envia o formulario
  e.preventDefault();

  const confirmeUser = accounts.findIndex(
    acc => acc.username === inputCloseUsername.value
  );

  if (
    inputCloseUsername.value === currentAccount.username &&
    Number(inputClosePin.value) === currentAccount.pin
  ) {
    accounts.splice(confirmeUser, 1);

    //Manipulando o HTML
    containerApp.style.opacity = 0;
  }
  inputCloseUsername.value = inputClosePin.value = '';
});

//SORT BUTTON

let isSorted = false;

btnSort.addEventListener('click', function (e) {
  //Nao envia o formulario
  e.preventDefault(e);

  //Cópia do array
  const sortedArr = currentAccount.movements.slice();
  sortedArr.sort((a, b) => a - b);

  if (isSorted) {
    // Restaura a ordem original
    displayMovements(currentAccount.movements);

    isSorted = false;
  } else {
    // Ordena o array
    displayMovements(sortedArr);
    isSorted = true;
  }
});

//DATE

function formatDate(data) {
  const dia = data.getDate().toString().padStart(2, '0');
  const mes = (data.getMonth() + 1).toString().padStart(2, '0');
  const ano = data.getFullYear();
  const hora = data.getHours();
  const minuto = data.getMinutes();
  const dateFormated = `${dia}/${mes}/${ano}, ${hora}:${minuto}`;
  balanceDate.textContent = dateFormated;
}
