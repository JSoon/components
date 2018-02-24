// 异步加载a模块
require.ensure(['./a'], function (require) {
    var a = require('./a');

    // Do something special...
    var com_toast = require('components/toast/toast');

    $('#J_ComToast').click(function () {
        com_toast('I\'m a toast!', 2000);
    });
}, 'async');

const a = () => {
    alert('aaaaa');
    alert('aaaaa');
};