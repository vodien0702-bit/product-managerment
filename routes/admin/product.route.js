const express = require('express');
const multer = require('multer');
// const storageMulter = require('../../helpers/uploadMulter');
const router = express.Router();
const validate = require('../../validates/admin/product.validate');
const upload = multer();
// clouddinary...
const uploadImage = require('../../middlewares/admin/uploadImage.middleware');
// end clouddinary

const controller = require('../../controllers/admin/product.controller');

router.get('/', controller.index);

router.patch('/change-status/:status/:id', controller.status);

router.patch('/change-multi-status', controller.changeMultiStatus);

router.delete('/delete/:id', controller.delete);

router.get('/create', controller.create);

router.post(
    '/create', upload.single('thumbnail'),
    uploadImage.uploadImage,
    validate.createPost,
    controller.createPost
);

router.get('/edit/:id', controller.edit);

router.patch('/edit/:id',
    upload.single('thumbnail'),
    uploadImage.uploadImage,
    validate.createPost,
    controller.editPatch);

// [GET] /admin/products/detail/:slug
router.get('/detail/:slug', controller.detail);
module.exports = router;