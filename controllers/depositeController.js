const accountDeposite = require("../models/userAccountModel");
const depositeDetail = require("../models/depositeModel");
var jwt = require("jsonwebtoken");

module.exports = {

  deposite: function (req, res, next) {
    // get the receiver balance and add the amount to be deposited
    var DepositeBalance = parseFloat(req.body.balance) + parseFloat(req.body.amount);

    var phone = req.body.phone;
    var amount = req.body.amount;
    
// finding and updating the receiver account balance using his / her unique phone number to update account balance
    accountDeposite.findOneAndUpdate(
      { phone: phone },{ balance: DepositeBalance },{ new: true },
      function (err, data) {
        if (err) throw err;
     
        res.status(200).json({
            status: true,
            account: data,
            message: 'Deposited Successfully',
        });

          // saving deposite details into the database

        var depositeInfo = new depositeDetail({
            amount,
            phone
            
        });

        // saves to mongodb
        depositeInfo.save(function(err, data){
            console.log(data);
        });
      }
    );
  },


  // function used for geting all deposite detail  using user unique phone
  GetDeposite:function (req, res, next) {
    var phone = req.body.phone;
    depositeDetail.findmany({phone:phone}, function(err, data){

      if (err) throw err;
      if (data == null) {
          res.status(400).json({
            status: true,
            
            message: 'user has no Deposite History',
        });
      } else {
          res.send({despoite:data})
      }
  })
  }
};
