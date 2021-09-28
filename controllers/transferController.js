const account = require("../models/userAccountModel");
const TransferDetail = require("../models/transferModel");
var jwt = require("jsonwebtoken");

module.exports = {
  AccountTransfer: function (req, res, next) {
      // get the sender balance and minus the amount to be transfered to the receiver
    var updatedBalance = parseFloat(req.body.balance) - parseFloat(req.body.amount);
    
// if the balance of the send is less than zero , then updated balance will be zero
    if (updatedBalance < 0) updatedBalance = 0.0;

    var sender = req.body.phone; // sender unique phone number 
    var amount = req.body.amount; // amount to be transfered from the sender
    var receiver = req.body.phone; // receiver unique phone number

    var phone = {sender}
    var Balance = {updatedBalance}
    
// finding and updating the sender account balance using his / her unique phone number and update balance
    account.findOneAndUpdate(phone,Balance)
      .then((destinationAcc) => {

        // finding receiver unique phone number from the database 
        var accountDetail = account.findOne({ phone: receiver });
        // checking if the receiver unique phone number exist or not
        if (accountDetail == null ) {

            res.status(500).json({msg: 'Receiver account does not Exist'});


        } else {

            // Geting the receiver account balance from datas returned from the database and
            // adding senders amount to receivers account balance
          var transferAmount = parseFloat(accountDetail.Balance) + parseFloat(amount);

          //   updating the receiver account balance using his / her unique phone number to update receiver account  balance
          account.findByIdAndUpdate({ phone: receiver }, { Balance: transferAmount },{ new: true },
            function (err, data) {
              if (err) throw err;

              res.status(200).json({
                status: true,
                account: data,
                message: "transfered Successfully",
              });

              // saving transfer details into the database
              var transferInfo = new TransferDetail({
                sender,
                amount,
                receiver
              });
    
              // saves to mongodb
              transferInfo.save(function (err, data) {
                console.log(data);
              });


            });

        }

      });
  },

  // function used for geting all transfers detail using user unique phone

  GetTransfer: function (req, res, next) {
    var phone = req.body.phone;
    TransferDetail.findmany({ phone: phone }, function (err, data) {
      if (err) throw err;
      if (data == null) {
        res.status(400).json({
          status: true,

          message: "user has no transfer History",
        });
      } else {
        res.send({ withdraw: data });
      }
    });
  },
};
