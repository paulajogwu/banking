const { deposite, GetBalance, AccountWithdrawal,AccountTransfer, createUser} = require("./util");

test("should create account for A user", () => {
  const firstname = " sammy";
  const lastname = "Tammy";
  const email = "Tammy@gmail.com";
  const phone = "07012515758";
  const passwordd = "Tammy123456";
  const Balance = 0;

  createUser(firstname, lastname, email, phone, passwordd, Balance);
});

test("should create account for B user", () => {
  const firstname = "Paul";
  const lastname = "chukwudi";
  const email = "Paul@gmail.com";
  const phone = "09034562259";
  const passwordd = "paul12345";
  const Balance = 0;

  createUser(firstname, lastname, email, phone, passwordd, Balance);
});

/// A deposite 10 dollars

test("should deposite 10 dollar to A account", () => {
  var Balance = 0;
  var amount = 10;
  var phone = "07012515758";
  var DepositeBalance = parseFloat(Balance) + parseFloat(amount);
  if (DepositeBalance < 0) DepositeBalance = 0.0;

  deposite(phone, DepositeBalance);
});

/// A deposite 10 dollars
test("should deposite 20 dollar to B account", () => {
  var Balance = 0;
  var amount = 20;
  var phone = "09034562259";
  var DepositeBalance = parseFloat(Balance) + parseFloat(amount);
  if (DepositeBalance < 0) DepositeBalance = 0.0;

  deposite(phone, DepositeBalance);
});

// B transfers 15 dollars to B account

test("should Transfer 15 dollars from B account to A account", () => {
  var Balance = 20;
  var amount = 15;
  var sender = "09034562259"; // B
  var receiver = "07012515758"; // A
  var phone = { sender };
  var Balance = { updatedBalance };

  var updatedBalance = parseFloat(Balance) - parseFloat(amount);
  if (updatedBalance < 0) updatedBalance = 0.0;

  AccountTransfer(phone, Balance, receiver, sender);
});

// B Checks account Balance

test("should check B account Balance", () => {
  var phone = "09034562259";

  GetBalance(phone);
});

//// A witdraw 25 dollars

test("should withdraw 25 dollars from A account", () => {
  var Balance = 25;
  var amount = 25;
  var phone = "07012515758";
  var updatedBalance = parseFloat(Balance) - parseFloat(amount);
  if (updatedBalance < 0) updatedBalance = 0.0;

  AccountWithdrawal(phone, updatedBalance);
});

////// A Checks Account Balance

test("should check A account Balance", () => {
  var phone = "07012515758";

  GetBalance(phone);
});
