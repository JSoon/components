/**
 * 简单信息提示
 * 
 * @author J.Soon <serdeemail@gmail.com>
 */
(function (root, factory) {
    // 组件名称
    var comPrefix = 'com_'; // 前缀
    var comName = 'toast'; // 名称
    var globalName = comPrefix + comName; // 全局名称

    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        // Defines a module "amdWebGlobal" that depends another module called "b".
        // define(['b'], function (b) {
        define(function (b) {
            // Also create a global in case some scripts
            // that are loaded still are looking for
            // a global even when an AMD loader is in use.
            return (root[globalName] = factory(b));
        });
    } else {
        // Browser globals
        // root[globalName] = factory(root.b);
        root[globalName] = factory();
    }
}(typeof self !== 'undefined' ? self : this, function (b) {
    /**
     * toast
     * 
     * @param {string}  content    提示内容
     * @param {number}  duration   内容显示时间
     */
    function toast(content, duration) {
        // 加载前端模板
        // toastTemplate为预编译后的模板函数，若没有，则采用AMD的方式进行装载（需要使用AMD加载器或者使用webpack）
        var tmpl = toastTemplate || require('./toast.pug');
        // 编译为html字符串
        var html = $(tmpl({
            content: content
        }));
        // 添加到页面
        var body = $('body');
        body.append(html);
        // 设置内容消失时间
        var duration = duration || 2000;
        setTimeout(function () {
            html.animate({
                opacity: 0
            }, 700, function () {
                $(this).remove();
            });
        }, duration);
    }

    return toast;
}));