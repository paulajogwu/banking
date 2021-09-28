const account = require("./models/userAccountModel");
const depositeDetail = require("./models/depositeModel");
const withdrawalDetail = require("./models/withdrawalModel");
const TransferDetail = require("./models/transferModel");
var jwt = require("jsonwebtoken");


///  Create Account Function
exports.createUser = async (
  firstname,
  lastname,
  email,
  phone,
  passwordd,
  Balance
) => {


  console.log(
    "accountinfo",
    firstname,
    lastname,
    email,
    phone,
    passwordd,
    Balance
  );

  // Check if user  exits
  if (
    firstname == "" ||
    firstname == null ||
    lastname == "" ||
    lastname == null ||
    email == "" ||
    email == null ||
    phone == "" ||
    phone == null ||
    passwordd == "" ||
    passwordd == null
  ) {
    console.log(
      "Fill out all required feilds ( firstname, lastname, email, mobile and password"
    );
  } else {
    // get the total users object of available users
    var all_users = await account
      .find({})
      .then((users) => users)
      .catch(() => null);
    console.log("we move", all_users);

    // check user email
    var check_email = await account
      .findOne({ email: email })
      .then((user) => user)
      .catch(() => null);

    // check user mobile
    var check_mobile = await account
      .findOne({ phone: phone })
      .then((user) => user)
      .catch(() => null);

    // if email exist
    if (check_email) {
      // If user exists with same email
      console.log("A user exist with same email");
    }

    // If mobile number exists.
    else if (check_mobile) {
      console.log("A user exists with same number");
    } else {
      var create_new_user = async () => {
        var doc = await new account({
          firstname,

          lastname,

          email,
          phone,
          Balance,
          password: bcrypt.hashSync(passwordd, 10),
        })

          .save({})
          .then((user) => user)
          .catch(() => {
            conssole.log("Error saving user");
          });

        if (doc) {
          new account({
            email,
            user_id: doc._id,
          })
            .save({})
            .then((user) => {
              jwt.sign({ doc }, "jwtSecret", (err, token) => {
                console.log("Registration Successful");
              });
            })
            .catch((err) => console.log(err));
        }
      };

      if (phone == "" || phone == null || phone == undefined) {
        //Create the user
        create_new_user();
      } else {
        // mobi
        if (!phone) {
          console.log("Referral email does not exists");
        } else {
          // Create the user
          create_new_user();
        }
      }
    }
  }
};

module.exports = {
  ///////////////////////              Deposite  function

  deposite: function (phone, DepositeBalance) {
    // finding and updating the receiver account balance using his / her unique phone number to update account balance
    account.findOneAndUpdate(
      { phone: phone },
      { balance: DepositeBalance },
      { new: true },
      function (err, data) {
        if (err) throw err;

        console.log("Deposited Successfully");
        // saving deposite details into the database

        var depositeInfo = new depositeDetail({
          amount,
          phone,
        });

        // saves to mongodb
        depositeInfo.save(function (err, data) {
          console.log(data);
        });
      }
    );
  },

  ///////////////////////              Account Balance  function

  GetBalance: function (phone) {
    account.findOne({ phone: phone }, function (err, data) {
      if (err) throw err;
      if (data == null) {
        console.log(" 'user does not have account'");
      } else {
        console.log(data.Balance);
      }
    });
  },




  ///////////////////////    Withdrawal  function

  AccountWithdrawal: function (phone, updatedBalance) {
    // get the account balance and minus the amount to be withdraw from the user account

    // finding and updating the  account balance using user unique phone number and update balance
    account.findOneAndUpdate(
      { phone: phone },
      { Balance: updatedBalance },
      { new: true },
      function (err, data) {
        if (err) throw err;

    console.log(" withdrawal Successful")

        // saving withdrawal details into the database
        var withdrawInfo = new withdrawalDetail({
          phone,
          amount,
        });

        // saves to mongodb
        withdrawInfo.save(function (err, data) {
          console.log(data);
        });
      }
    );
  },

  //////////////////            Transfer  function

  AccountTransfer: function (phone, Balance, receiver, sender) {
    // finding and updating the sender account balance using his / her unique phone number and update balance
    account.findOneAndUpdate(phone, Balance).then((destinationAcc) => {
      // finding receiver unique phone number from the database
      var accountDetail = account.findOne({ phone: receiver });
      // checking if the receiver unique phone number exist or not
      if (accountDetail == null) {
        console.log("Receiver account does not Exist" )
      } else {
        // Geting the receiver account balance from datas returned from the database and
        // adding senders amount to receivers account balance
        var transferAmount =parseFloat(accountDetail.Balance) + parseFloat(amount);

        //   updating the receiver account balance using his / her unique phone number to update receiver account  balance
        account.findByIdAndUpdate(
          { phone: receiver },
          { Balance: transferAmount },
          { new: true },
          function (err, data) {
            if (err) throw err;

            console.log("transfered Successfully")

            // saving transfer details into the database
            var transferInfo = new TransferDetail({
              sender,
              amount,
              receiver,
            });

            // saves to mongodb
            transferInfo.save(function (err, data) {
              console.log(data);
            });
          }
        );
      }
    });
  },
};
