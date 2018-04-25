/**
 * 图片懒加载
 * 
 * @description 当图片出现在可视区域中时，再进行加载，有效减少带宽开销，提高文档加载速度
 * @author J.Soon <serdeemail@gmail.com>
 */
(function (root, factory) {
    // 组件名称
    var comPrefix = 'com_'; // 前缀
    var comName = 'lazyImage'; // 名称
    var globalName = comPrefix + comName; // 全局名称

    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        // Defines a module "amdWebGlobal" that depends another module called "b".
        define(['../utils/getElementBoundary'], function (getElementBoundary) {
            // Also create a global in case some scripts
            // that are loaded still are looking for
            // a global even when an AMD loader is in use.
            return (root[globalName] = factory(getElementBoundary));
        });
    } else {
        // Browser globals
        // root[globalName] = factory(root.b);
        var getElementBoundary = root['com_getElementBoundary'];
        root[globalName] = factory(getElementBoundary);
    }
}(typeof self !== 'undefined' ? self : this, function (getElementBoundary) {

    var t; // window scroll事件延迟定时器
    var scrollHandler; // window scroll事件句柄的引用，用于防止多次绑定

    /**
     * 图片懒加载
     * @param {object} opts 
     * @param {string} opts.attr    懒加载图片真实src地址属性，默认获取data-src
     * @param {number} opts.delay   懒加载延迟时间，即图片出现在可视区域delay毫秒后，再进行加载，默认600ms
     */
    function lazyImage(opts) {
        opts = opts || {};
        var attr = opts.attr || 'data-src';
        var delay = opts.delay || 600;
        var selector = 'img[' + attr + ']';
        var $images = $(selector);

        // 可视区域图片加载
        var loadImage = function () {
            var docRoot = document.documentElement || document.body.parentNode; // 文档根节点，对于html文档来说，则是<html>元素                
            var docHeight = docRoot.clientHeight; // html文档可视区域高度                
            var scrollY = (window.pageYOffset !== undefined) ? window.pageYOffset : docRoot.scrollTop; // 文档垂直方向滚动距离

            $images.each(function (index, image) {
                var boundary = getElementBoundary(image);
                var loaded = image.hasAttribute('data-loaded'); // 是否已经加载（仅代表图片src已经赋值，并不代表图片成功加载）
                var dataSrc = image.getAttribute(attr); // 图片真实src地址

                // 若图片已加载或者缺少图片真实src地址，则不进行图片加载
                if (loaded || !dataSrc) {
                    return;
                }

                /**
                 * 懒加载条件
                 * 1. 由上至下滚动：boundary.top - scrollY < docHeight
                 */
                if (boundary.top - scrollY < docHeight) {
                    image.src = dataSrc;
                    image.setAttribute('data-loaded', '');
                }
            });
        };

        // 首屏图片优先加载
        loadImage();

        // 移除之前的scroll事件句柄，防止重复绑定
        $(window).off('scroll', scrollHandler);

        // 滚动条scroll事件处理句柄
        scrollHandler = function () {
            clearTimeout(t);
            t = setTimeout(function () {
                loadImage();
            }, delay);
        };

        // 绑定新的scroll事件句柄
        $(window).on('scroll', scrollHandler);
    }

    return lazyImage;

}));