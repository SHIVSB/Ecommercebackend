const categoryController = require("../../src/controllers/categoryController");
const categoryModel = require("../../src/models/category");
const { mockRequest, mockResponse } = require('../mocker');
const jestMock = require('jest-mock');

const testPayload = [
    {
        categoryId : 1,
        name : "Electronics"
    },
    {
        categoryId : 2,
        name : "Fashion"
    }
];

test('Category controller should return error on all category', async() => {
    const spy = jestMock.spyOn(categoryModel, 'listCategories').mockImplementation((cb) => {
        cb(new Error("This is a new error"), null);
    });

    const req = mockRequest();
    const res = mockResponse();

    await categoryController.listCategories(req, res);
    expect(spy).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.send).toHaveBeenCalledWith({message: "Not Ok",
    success:false,
    categories:null
    })
})

test('This test should successfully fetch categpries', async() =>{
    const req = mockRequest();
    const res = mockResponse();

    const spy = jestMock.spyOn(categoryModel, 'listCategories').mockImplementation((cb) => {
        cb(null, testPayload);
    });

    await categoryController.listCategories(req,res);

    expect(spy).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.send).toHaveBeenCalledWith({message : "ok",
        success : true,
        categories : testPayload
    })
})