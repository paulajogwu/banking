const account = require("../models/userAccountModel");
const withdrawalDetail = require("../models/withdrawalModel");
var jwt = require("jsonwebtoken");

module.exports = {

  AccountWithdrawal: function (req, res, next) {

        // get the account balance and minus the amount to be withdraw from the user account
    var updatedBalance = parseFloat(req.body.balance) - parseFloat(req.body.amount);

    console.log("updatedBalance",updatedBalance)
    if (updatedBalance < 0) updatedBalance = 0.0;

    var phone = req.body.phone;
    var amount = req.body.amount;

        
// finding and updating the  account balance using user unique phone number and update balance
    account.findOneAndUpdate(
      { phone: phone },{ Balance: updatedBalance },{ new: true },
      function (err, data) {
        if (err) throw err;
     
        res.status(200).json({
            status: true,
            account: data,
            message: 'withdrawal Successful',
        });


 // saving withdrawal details into the database
        var withdrawInfo = new withdrawalDetail({
          phone,amount
          });

        // saves to mongodb
        withdrawInfo.save(function(err, data){
            console.log(data);
        });
      }
    );
  },


  // function used for geting all Withdrawal detail using user unique phone
  GetWithdraw:function (req, res, next) {
    var phone = req.body.phone;
    withdrawalDetail.findmany({phone:phone}, function(err, data){

      if (err) throw err;
      if (data == null) {
          res.status(400).json({
            status: true,
            
            message: 'user has no Withdrawal History',
        });
      } else {
          res.send({withdraw:data})
      }
  })
  }
};
