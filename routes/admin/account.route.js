const express = require('express');
const multer = require('multer');
const router = express.Router();
const controller = require('../../controllers/admin/account.controller');
const validate = require('../../validates/admin/account.validate');
const upload = multer();
// cloud dinary
const uploadImage = require('../../middlewares/admin/uploadImage.middleware');
// end cloud dinary

router.get('/', controller.index);


router.get('/create', controller.create);

router.post('/create', 
    upload.single("avatar"),
    uploadImage.uploadImage,
    validate.createPost,
    controller.createPost
);

router.get('/edit/:id', controller.edit);

router.patch('/edit/:id',
    upload.single("avatar"),
    uploadImage.uploadImage,
    validate.editPost,
    controller.editPatch
)

router.delete('/delete/:id', controller.delete);

router.get('/detail/:id', controller.detail);
module.exports = router;