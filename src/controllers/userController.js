const User = require("../models/user");
const auth = require("../util/auth");
const {httpCodes, userType} = require("../constants/backendConfig");

function signup(req, res) {
    let data = req.body;
    let responseData = {
        success: false,
        msg: "Invalid details for signup"
    };
    if(data.username && data.password) {
        User.getUsersSignupDetails(data, function(err, result) {
            if(err) {
                console.log(err);
                responseData.msg = "Error in signup";
                return res.status(500).send(responseData);
            }
            if(result.length > 0) {
                responseData.msg = "User already exists";
                return res.status(500).send(responseData);
            } else {
                User.strongSignup(data, function(err1, result1) {
                    if(err1) {
                        return res.status(500).send(responseData);
                    }
                    responseData.success = true;
                    responseData.msg = "Successfully signed up";
                    responseData.data = {
                        username: data.username,
                    };
                    return res.status(200).send(responseData);
                })
            }
        })
    } else {
        return res.status(400).send(responseData);
    }
}

function login(req, res) {
    let data = req.body;
    let responseData = {
        success: false,
        msg: "Invalid details for signup"
    };
    if(data.username && data.password) {
        User.strongLogin(data, function(err, result) {
            if(err) {
                console.log(err);
                responseData.msg = "Error in signin";
                return res.status(500).send(responseData);
            }
            if(result.length == 0) {
                responseData.msg = "Invalid Email Or Password";
                return res.status(500).send(responseData);
            }
            responseData.success = true;
            responseData.msg = "Successfully logged in ";
            console.log(result);
            responseData.data = {
                username: result[0].Username,
                userId: result[0].UserId,
                authToken: result[0].authToken
            };
            return res.status(200).send(responseData);
        })
    } else {
        return res.status(400).send(responseData);
    }
}

function isAuthenticated(req, res, next) {
    const token = req.headers.auth;
    let response;
    try {
        response = auth.verifyToken(token);
    } catch(err) {
        console.log(err);
        return res.status(401).send({message: "Invalid Token"});
    }
    User.getUserById(response.id, function(err, result) {
        if(err) {
            return res.status(401).send({message: "Invalid user"});
        }
        req.user = result;
        next();
    });
}

module.exports = {
    getVendorDetails: function (req, res) {
		var data = req.body;
		var responseData = {
			success: false,
			msg: "Invalid params for fetching vendor details"
		};
		if (data.userId) {
			User.getVendorDetails(data, function (err, result) {
				if (err) {
					responseData.msg = "Error in fetching vendor details";
					return res.status(httpCodes.internalServerError).send(responseData);
				}
				responseData.success = true;
				responseData.msg ="Successfully fetched vendor details";
				responseData.vendorDetails = {
					username: result[0].username,
					gstin: result[0].gstin,
					pan: result[0].pan
				};
				return res.status(httpCodes.success).send(responseData);
			});
		} else {
			return res.status(httpCodes.badRequest).send(responseData);
		}
	},

	getVendorPayments: function (req, res) {
		var data = req.body;
		var responseData = {
			success: false,
			msg: "Invalid params for fetching vendor payments"
		};
		if (data.userId) {
			User.getVendorPayments(data, function (err, result) {
				if (err) {
					responseData.msg = "Error in fetching vendor payments";
					return res.status(httpCodes.internalServerError).send(responseData);
				}
				responseData.success = true;
				responseData.msg ="Successfully fetched vendor payments";
				responseData.vendorPayments = [];
				result.forEach((item) => {
					let foundOrder = false;
					responseData.vendorPayments.forEach((item1) => {
						if(item1.orderId == item.orderId) {
							foundOrder = true;
						}
					});
					if(!foundOrder) {
						const orderObj = {
							orderId: item.orderId,
							total: item.total,
							products: []
						};
						result.forEach((item2) => {
							const productObj = {
								price: item2.price,
								name: item2.productName,
								quantity: item2.quantity,
								productId: item2.productId
							};
							orderObj.products.push(productObj);
						});
						responseData.vendorPayments.push(orderObj);
					}
				});
				return res.status(httpCodes.success).send(responseData);
			});
		} else {
			return res.status(httpCodes.badRequest).send(responseData);
		}
	}
}

module.exports = {signup, login, isAuthenticated};