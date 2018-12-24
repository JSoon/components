(function (root, factory) {
    // 组件名称
    var comPrefix = 'com_'; // 前缀
    var comName = 'ajax'; // 名称
    var globalName = comPrefix + comName; // 全局名称

    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        // Defines a module "amdWebGlobal" that depends another module called "b".
        // define(['b'], function (b) {
        define(function () {
            // Also create a global in case some scripts
            // that are loaded still are looking for
            // a global even when an AMD loader is in use.
            return (root[globalName] = factory());
        });
    } else {
        // Browser globals
        // root[globalName] = factory(root.b);
        root[globalName] = factory();
    }
}(typeof self !== 'undefined' ? self : this, function (b) {

    // 请求提交中className
    var AJAX_SUBMITTING = 'com_ajax_submitting';

    function ajax(options) {
        // 参数对象
        options = {
            ajaxOpts: options.ajaxOpts || {}, // jQuery ajax参数
            btn: options.btn || null, // ajax事件绑定元素
            success: options.success || function () {}, // 成功回调函数
            fail: options.fail || function () {}, // 失败回调函数
            always: options.always || function () {}, // 无论成功/失败回调函数
        };
        
        // 防止重复提交
        if (options.btn) {
            if (options.btn.hasClass(AJAX_SUBMITTING)) {
                return;
            }

            options.btn.addClass(AJAX_SUBMITTING);
        }

        // 发起ajax请求
        $.ajax(options.ajaxOpts)
            .then(function (data, textStatus, jqXHR) {
                // success callback
                options.success(data, textStatus, jqXHR);
            }, function (jqXHR, textStatus, errorThrown) {
                // fail callback
                options.fail(jqXHR, textStatus, errorThrown);
            })
            .always(function () {
                // always callback
                options.always();
                if (options.btn) {
                    options.btn.removeClass(AJAX_SUBMITTING);
                }
            });

    }

    return ajax;

}));