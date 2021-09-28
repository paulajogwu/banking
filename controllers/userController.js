const account = require('../models/userAccountModel')
var jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
var ObjectId = require("mongoose").Types.ObjectId;



exports.createUser = async(req, res, next) => {
 
    const firstname = req.body.firstName;
    const lastname = req.body.lastName;
    const email = req.body.email;
    const phone = req.body.phone;
    const passwordd = req.body.password;
    const Balance = 0;
    console.log('accountinfo',firstname,lastname,email,phone,passwordd,Balance)
  
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
      res.status(500).json({
        status: false,
        message:
          "Fill out all required feilds ( firstname, lastname, email, mobile and password)",
        data: null,
      });
    } else {
     
      // get the total users object of available users
      var all_users = await account.find({})
        .then((users) => users)
        .catch(() => null);
        console.log("we move",all_users)
  
      // check user email
      var check_email = await account.findOne({ email: email })
        .then((user) => user)
        .catch(() => null);
  
      // check user mobile
      var check_mobile = await account.findOne({ phone: phone })
        .then((user) => user)
        .catch(() => null);
  
      // if email exist
      if (check_email) {
        // If user exists with same email
        res.status(400).json({
          status: false,
          message: "A user exist with same email",
          data: null,
        });
      }
  
      // If mobile number exists.
      else if (check_mobile) {
        res.status(400).json({
          status: false,
          message: "A user exists with same number",
          data: null,
        });
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
              res.status(500).json({
                status: false,
                message: "Error saving user",
                data: null,
              });
            });
  
          if (doc) {
            new account({
              email,
              user_id: doc._id,
            })
              .save({})
              .then((user) => {
                jwt.sign({ doc },  "jwtSecret", (err, token) => {
                  res.status(200).json({
                    status: true,
                    token,
                    user: doc,
                    message: "Registration Successful",
                  });
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
            res.status(400).json({
              status: false,
              message: "Referral email does not exists",
              data: null,
            });
          } else {
            // Create the user
            create_new_user();
          }
        }
      }
    }

}








exports.login = async(req, res, next) => {
 
  // set email or username and password variables to the req ie user input
  //const { , password } = req.body;
  const emails =req.body.email;
  const password =req.body.password;
  // find user, and exclude the pin column
 
  account.findOne({
    email: emails,
  }).then((user) => {
      if (!user) {
        // If user does not exists
        res.status(404).json({
          status: false,
          message: "User not found",
          data: null,
        });
        // console.log(res)
      } else {
        let hash = user.password;
        // Match password
        if (bcrypt.compareSync(password, hash)) {
          //if Passwords match

          // fetch user wallet and return wallet and user details
          var user_id = user._id;

          console.log("user details",user)
          account.findOne(
            {
              user_id: user_id,
            },
            (err, docs) => {
              if (!err) {
                jwt.sign({user},
                  "jwtSecret",
                  (err, token) => {
                    console.log("boy",user,token)
                    res.status(200).json({
                      status: true,
                      token,
                      user,
                      message: "Login Successful",
                    });
                  }
                );
              } else {
                console.log(
                  "Error fetching user wallet: " +
                    JSON.stringify(err, undefined, 2)
                );
              }
            }
          );
        } else {
          //Passwords don't match
          res.status(400).json({
            status: false,
            message: "Password Incorrect",
            data: null,
          });
        }
      }
    })
    .catch((err) => console.log(err));
},




// Verify Token
function verifyToken(req, res, next) {
  // getting authorization header
  const bearerHeader = req.headers["authorization"];
  // check if bearer is undefined
  if (typeof bearerHeader !== "undefined") {
    // split the space coming
    const bearer = bearerHeader.split(" ");
    // get token from array
    const bearerToken = bearer[1];
    //set the token
    req.token = bearerToken;
    // move to the next
    next();
  } else {
    //forbidden
    res.sendStatus(403);
  }
}

// Get account Balance

module.exports ={
  GetBalance:function (req, res, next) {
    var phone = req.body.phone;
    account.findOne({phone:phone}, function(err, data){
  
      if (err) throw err;
      if (data == null) {
          res.status(400).json({
            status: true,
            
            message: 'user account does not exist',
        });
      } else {
          res.send(data.Balance)
      }
  })
  }
}
