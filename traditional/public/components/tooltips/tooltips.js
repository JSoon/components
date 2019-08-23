/**
 * 小提示
 * 
 * @description 悬浮于鼠标处的小提示信息
 * @author J.Soon <serdeemail@gmail.com>
 */
(function (root, factory) {
    // 组件名称
    var comPrefix = 'com_'; // 前缀
    var comName = 'tooltips'; // 名称
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

    /**
     * 小提示
     * @param {object} opts 
     * @param {string} opts.selector    jquery选择器，用于指定提示出现的html元素
     * @param {string} opts.content     提示信息html字符串，若元素title未指定，则使用该值
     * @param {string} opts.placement   提示信息出现位置，包括top, right, bottom, left，默认top上方 
     * @param {string} opts.className   提示信息额外样式名，若有多个，请使用空格符分隔
     * @param {object} opts.follow      提示目标元素出现位置是否跟随鼠标位置，默认false，相对于目标元素居中
     */
    function tooltips(opts) {
        var $body = $('body');
        var $ele = $(opts.selector);

        // 遍历目标元素，生成小提示
        $ele.each(function (index, element) {
            var content = $(element).attr('title') || opts.content || '';
            var placement = $(element).attr('data-placement') || opts.placement || 'top';
            var className = opts.className || '';
            var follow = opts.follow === true ? true : false;
            var $tips;
            $(element).on('mouseenter', function (e) {
                if (!content) {
                    return;
                }
                // 加载前端模板
                // tooltipsTemplate为预编译后的模板函数，若没有，则采用AMD的方式进行装载（需要使用AMD加载器或者使用webpack）
                var tmpl = typeof window.tooltipsTemplate !== 'undefined' ? window.tooltipsTemplate : require('./tooltips.pug');
                // 编译为html字符串，并转换成jquery对象
                $tips = $(tmpl({
                    content: content,
                    className: className + ' ' + placement
                }));
                $body.append($tips);
                // 计算元素相对于body边界的位置
                var boundary = getElementBoundary(element);
                // console.log(element);
                // console.log(boundary);
                adjustCoords({
                    event: e,
                    tips: $tips,
                    boundary: boundary,
                    placement: placement,
                    follow: follow
                });
                $tips.show();
            });
            $(element).on('mouseleave', function () {
                $tips.remove();
            });
        });
    }

    /**
     * 调整提示位置
     * @param {object} opts     
     * @param {object} opts.event       事件对象     
     * @param {object} opts.tips        提示jquery对象
     * @param {object} opts.boundary    提示目标元素边界对象
     * @param {object} opts.placement   提示目标元素出现位置
     * @param {object} opts.follow      提示目标元素出现位置是否跟随鼠标位置，默认false，相对于目标元素居中
     */
    function adjustCoords(opts) {
        var $tips = opts.tips;
        var $arrow = $tips.children('.tooltips-arrow'); // 小提示箭头
        var event = opts.event;
        var boundary = opts.boundary;
        var placement = opts.placement;
        var follow = opts.follow;
        var width = $tips.outerWidth(); // 小提示宽度
        var height = $tips.outerHeight(); // 小提示高度
        var aWidth = $arrow.outerWidth(); // 小提示箭头宽度
        var aHeight = $arrow.outerHeight(); // 小提示箭头高度
        var left; // 小提示出现的水平位置
        var top; // 小提示出现的垂直位置
        var docRoot = document.documentElement || document.body.parentNode; // 文档根节点，对于html文档来说，则是<html>元素        
        var scrollX = (window.pageXOffset !== undefined) ? window.pageXOffset : docRoot.scrollLeft; // 文档水平方向滚动距离
        var scrollY = (window.pageYOffset !== undefined) ? window.pageYOffset : docRoot.scrollTop; // 文档垂直方向滚动距离

        switch (placement) {
            case 'right': // 目标元素右方
                $tips.css({
                    top: getTop(),
                    right: boundary.right - width - aWidth
                });
                $arrow.css({
                    top: (height - aHeight) / 2,
                    right: width
                });
                break;
            case 'bottom': // 目标元素下方
                $tips.css({
                    top: boundary.top + boundary.height + aHeight,
                    left: getLeft()
                });
                $arrow.css({
                    bottom: height,
                    left: (width - aWidth) / 2
                });
                break;
            case 'left': // 目标元素左方
                $tips.css({
                    top: getTop(),
                    left: boundary.left - width - aWidth
                });
                $arrow.css({
                    top: (height - aHeight) / 2,
                    left: width
                });
                break;
            default: // 目标元素上方
                $tips.css({
                    top: boundary.top - height - aHeight,
                    left: getLeft()
                });
                $arrow.css({
                    top: height,
                    left: (width - aWidth) / 2
                });
                break;
        }

        // 获取小提示上边距
        function getTop() {
            if (!follow) {
                top = boundary.top + (boundary.height - height) / 2;
            } else {
                // 设置上边界
                if (event.clientY + scrollY - boundary.top <= height / 2) {
                    top = boundary.top;
                }
                // 设置下边界
                else if (event.clientY + scrollY + height / 2 >= boundary.top + boundary.height) {
                    top = boundary.top + boundary.height - height
                }
                // 正常范围
                else {
                    top = event.clientY + scrollY - height / 2;
                }
            }
            return top;
        }

        // 获取小提示左边距
        function getLeft() {
            if (!follow) {
                left = boundary.left + (boundary.width - width) / 2;
            } else {
                // 设置左边界
                if (event.clientX + scrollX - boundary.left <= width / 2) {
                    left = boundary.left;
                }
                // 设置右边界
                else if (event.clientX + scrollX + width / 2 >= boundary.left + boundary.width) {
                    left = boundary.left + boundary.width - width
                }
                // 正常范围
                else {
                    left = event.clientX + scrollX - width / 2;
                }
            }
            return left;
        }
    }

    return tooltips;

}));