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
     * @param {string} opts.html        提示信息html字符串，若元素title未指定，则使用该值
     * @param {string} opts.placement   提示信息出现位置，包括top, right, bottom, left，默认top上方 
     * @param {string} opts.className   提示信息额外样式名，若有多个，请使用空格符分隔
     */
    function tooltips(opts) {
        var $body = $('body');
        var $ele = $(opts.selector);

        // 遍历目标元素，生成小提示
        $ele.each(function (index, element) {
            // 计算元素相对于body边界的位置
            var boundary = getElementBoundary(element);
            console.log(element);
            console.log(boundary);
            var html = $ele.attr('title') || opts.html || '';
            var placement = $ele.attr('data-placement') || opts.placement || 'top';
            var className = opts.className || '';
            var tips = $('<div class="tooltips"></div>');
            if (html) {
                $body.append(tips);
                tips.append(html).addClass(className);
                adjustCoords({
                    tips: tips,
                    boundary: boundary,
                    placement: placement
                });
                tips.show();
            }

        });
    }

    /**
     * 调整提示位置
     * @param {object} opts     
     * @param {object} opts.tips        提示jquery对象
     * @param {object} opts.boundary    提示目标元素边界对象
     * @param {object} opts.placement   提示目标元素出现位置
     */
    function adjustCoords(opts) {
        var $tips = opts.tips;
        var boundary = opts.boundary;
        var placement = opts.placement;
        var width = $tips.outerWidth();
        var height = $tips.outerHeight();

        switch (placement) {
            case 'right':
                $tips.css({
                    top: boundary.top + (boundary.height - height) / 2,
                    right: boundary.right - width
                });
                break;
            case 'bottom':
                $tips.css({
                    top: boundary.top + boundary.height,
                    left: boundary.left + (boundary.width - width) / 2
                });
                break;
            case 'left':
                $tips.css({
                    top: boundary.top + (boundary.height - height) / 2,
                    left: boundary.left - width
                });
                break;
            default:
                $tips.css({
                    top: boundary.top - height,
                    left: boundary.left + (boundary.width - width) / 2
                });
                break;
        }
    }

    return tooltips;

}));