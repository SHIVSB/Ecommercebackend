const sqlConnection = require("../services/sqlConnection");
const bcrypt = require("bcryptjs");
const res = require("express/lib/response");
const auth = require("../util/auth");

function signup(data, cb) {
    let sql = `INSERT INTO Users 
               (Username, Password, CreatedAt, UpdatedAt)
               Values (? , ? , now(), now())`;
    let values = [];
    values.push(data.username);
    values.push(data.password);
    sqlConnection.executeQuery(sql, values, function(err, result) {
        cb(err, result);
    });
}

function strongSignup(data, cb) {
    let sql = `INSERT INTO Users 
    (Username, Password, CreatedAt, UpdatedAt)
    Values (? , ? , now(), now())`;
    let values = [];
    values.push(data.username);
    bcrypt.hash(data.password, 8, function(err, hash) {
        if(err) {
            console.log(err);
            return;
        }
        values.push(hash);
        sqlConnection.executeQuery(sql, values, function(err, result) {
            cb(err, result);
        });
    });
}

function getUsersSignupDetails(data, cb) {
    let sql = "SELECT * FROM Users WHERE Username = ?";
    let values = [];
    values.push(data.username);
    sqlConnection.executeQuery(sql, values, function(err, result) {
        cb(err, result);
    });
}

function login(data, cb) {
    let sql = `SELECT ID as UserId, Username, UserType 
               FROM Users WHERE 
               Username = ? AND Password = ?`;
    let values = [];
    values.push(data.username);
    values.push(data.password);
    sqlConnection.executeQuery(sql, values, function(err, result) {
        cb(err, result);
    });
}

function strongLogin(data, cb) {
    let sql = `SELECT ID as UserId, Username, Password, UserType 
               FROM Users WHERE 
               Username = ?`;
    let values = [];
    values.push(data.username);
    sqlConnection.executeQuery(sql, values, function(err, result) {
        // console.log(data.password, result, result[0].Password);
        const isValidPass = bcrypt.compareSync(data.password, result[0].Password);

        if(isValidPass) {
            const token = auth.newToken(result[0]);
            const response = [
                {
                    UserId: result[0].UserId,
                    Username: result[0].Username,
                    UserType: result[0].UserType,
                    authToken: token
                }
            ];
            cb(err, response);
        } else {
            cb(err, []);
        }
        //cb(err, result);
    });
}

function getUserById(id, cb) {
    let sql = `SELECT ID as UserId, Username, UserType 
               FROM Users WHERE 
               ID = ?`;
    let values = [];
    values.push(id);
    sqlConnection.executeQuery(sql, values, function(err, result) {
        cb(err, result);
    });
}

module.exports ={
    addVendorDetails: function(data, callback) {
		var sql = "INSERT INTO VendorDetails (GSTIN, PAN, UserID, CreatedAt, UpdatedAt) VALUES (?, ?, ?, now(), now())";
		var values = [];
		values.push(data.gstin);
		values.push(data.pan);
		values.push(data.vendorId);
		sqlConnection.executeQuery(sql, values, function(err, result) {
			callback(err, result);
		});
	},

	getVendorDetails: function(data, callback) {
		var sql = "SELECT u.Username AS username, vd.GSTIN AS gstin, vd.PAN as pan FROM Users AS u LEFT JOIN "
			+ "VendorDetails AS vd ON u.ID = vd.userID WHERE u.ID = ? LIMIT 1";
		var values = [];
		values.push(data.userId);
		sqlConnection.executeQuery(sql, values, function(err, result) {
			callback(err, result);
		});
	},

	getVendorPayments: function(data, callback) {
		var sql = "SELECT od.ID AS orderId, od.Total AS total, p.ID AS productId, p.Name AS productName, p.price AS price, "
			+ "oi.Quantity AS quantity FROM OrderDetails AS od LEFT JOIN OrderItems AS oi ON od.ID = oi.OrderID"
			+ " LEFT JOIN Products AS p ON p.ID = oi.ProductID WHERE p.VendorID = ? AND od.OrderStatus = 2 LIMIT 1";
		var values = [];
        values.push(data.userId);
		sqlConnection.executeQuery(sql, values, function(err, result) {
			callback(err, result);
		});
	}
}

module.exports = {signup, getUsersSignupDetails, getUserById,login, strongSignup, strongLogin};