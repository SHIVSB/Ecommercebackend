const Category = require('../models/category');

module.exports = {
    listCategories: function(req,res){
        Category.listCategories(function(err, result){
            if(err){
                console.log(err);
                return res.status(500).send({
					message: "Not Ok",
                    success:false,
					categories : result                
				});
            }

            return res.status(200).send(
                {message : "ok",
                success : true,
                 categories : result
				});
        })

    }
}
