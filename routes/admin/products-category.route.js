// express
const express = require('express');

// router
const router = express.Router();

// validate
const validate = require('../../validates/admin/products-category.validate');

// upload image
const multer = require('multer');
const upload = multer();
const uploadImage = require('../../middlewares/admin/uploadImage.middleware');

// controller
const controller = require('../../controllers/admin/products-category.controller');

// [GET] /admin/products-category
router.get('/', 
    controller.index
);

//[PATCH] /admin/products-category/change-status/:status/:id
router.patch('/change-status/:status/:id',
    controller.status
)

// [DELETE] /admin/products-category/delete/:id
router.delete('/delete/:id', 
    controller.delete
);

// [GET] /admin/products-category/detail/:slug
router.get('/detail/:slug', 
    controller.detail
)

// [GET] /admin/products-category/edit/:id
router.get('/edit/:id', 
    controller.edit
)

// [PATCH] /admin/products-category/edit/:id
router.patch('/edit/:id', 
    upload.single('thumbnail'),
    uploadImage.uploadImage,
    validate.createPost,
    controller.editPatch
)

// [PATCH] /admin/products-category/change-multi-status
router.patch('/change-multi-status',
    controller.changeMultiStatus
);

// [GET] /admin/products-category/create
router.get('/create',
    controller.create
);


// [POST] /admin/products-category/create
router.post('/create',
    upload.single('thumbnail'),
    uploadImage.uploadImage,
    validate.createPost,
    controller.createPost
);


module.exports = router