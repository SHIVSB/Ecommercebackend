const Product = require("../models/product");

function listProducts(req, res) {
    var data = req.body;
		var responseData = {
			success: false,
			msg: "Invalid params for fetching products"
        	};
		Product.listProducts(data, function (err, result) {
			if (err) {
				responseData.msg = "Error in fetching products";
				return res.status(500).send(responseData);
			}
			responseData.success = true;
			responseData.msg ="Successfully fetched products";
			responseData.products = result;
			return res.status(200).send(responseData);
		})
}

function addProduct(req, res) {
    let data = req.body;
    if(data.name && data.price && data.description && data.categoryId && data.vendorId) {
        Product.addProduct(data, function(err, result) {
            if(err) {
                console.log(err);
                return res.status(500).send({message: "Not ok!"});
            }
            return res.status(200).send({
                success: true,
                msg: "Successfully added products",
                products: result
            })
        })
    }
}


function getProductDetails(req, res){
    let data = req.body;

    const responseData ={
        success : false,
        message : "Invalid params for details"
    };

    if(data.userId && data.productId){
        Product.getProductDetails(data, function(err, result){
            if(err){
                console.log("Error in getting product details");
                res.status(500).send(responseData);
            }else{
                responseData.success = true;
                responseData.message = "Product details fetched successfully";
                responseData.productDetails = result[0];
                res.status(200).send(responseData);
            }
        })
    }else{
        res.status(400).send(responseData);
    }
}


module.exports = {listProducts,addProduct, getProductDetails};