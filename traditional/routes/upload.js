var express = require('express');
var router = express.Router();

/* 文件上传 */
router.post('/', function (req, res, next) {
    res.json({
        success: true,
        message: '上传成功！'
    });
});

module.exports = router;