/**
 * 计算元素相对于body边界的位置
 * 
 * @author J.Soon <serdeemail@gmail.com>
 */
(function (root, factory) {
    // 组件名称
    var comPrefix = 'com_'; // 前缀
    var comName = 'getElementBoundary'; // 名称
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

    /**
     * 计算元素相对于body边界的位置
     * 
     * @description 需要确保html的margin和padding为0，否则会得到不准确的边界位置
     * @param {object} element html元素 
     */
    function getElementBoundary(element) {
        var docRoot = document.documentElement || document.body.parentNode; // 文档根节点，对于html文档来说，则是<html>元素
        // https://developer.mozilla.org/en-US/docs/Web/API/Element/clientWidth
        // https://developer.mozilla.org/en-US/docs/Web/API/Element/clientHeight
        var docWidth = docRoot.clientWidth; // html文档可视区域宽度
        var docHeight = docRoot.clientHeight; // html文档可视区域高度
        var body = document.body;
        // https://developer.mozilla.org/en-US/docs/Web/API/Element/currentStyle
        // https://developer.mozilla.org/en-US/docs/Web/API/Window/getComputedStyle
        var bodyStyle = body.currentStyle || window.getComputedStyle(body);
        var styleUnitReg = /px|em|rem/gi;
        var bodyMarginLeft = Number(bodyStyle.marginLeft.replace(styleUnitReg, ''));
        var bodyMarginRight = Number(bodyStyle.marginRight.replace(styleUnitReg, ''));
        var bodyMarginTop = Number(bodyStyle.marginTop.replace(styleUnitReg, ''));
        var bodyMarginBottom = Number(bodyStyle.marginBottom.replace(styleUnitReg, ''));
        var bodyWidth = body.clientWidth + bodyMarginLeft + bodyMarginRight; // body宽度（包括margin）
        var bodyHeight = body.clientHeight + bodyMarginTop + bodyMarginBottom; // body高度（包括margin）
        var width = element.clientWidth; // 目标元素宽度
        var height = element.clientHeight; // 目标元素高度

        // https://developer.mozilla.org/en-US/docs/Web/API/Element/getBoundingClientRect
        var bounding = element.getBoundingClientRect();
        var scrollX = (window.pageXOffset !== undefined) ? window.pageXOffset : docRoot.scrollLeft; // 文档水平方向滚动距离
        var scrollY = (window.pageYOffset !== undefined) ? window.pageYOffset : docRoot.scrollTop; // 文档垂直方向滚动距离
        var offsetLeft = bounding.left + scrollX; // 目标元素相对文档左边界距离
        var offsetTop = bounding.top + scrollY; // 目标元素相对文档上边界距离
        var offsetRight = bodyWidth - offsetLeft - width; // 目标元素相对文档右边界距离
        var offsetBottom = bodyHeight - offsetTop - height; // 目标元素相对文档下边界距离

        return {
            left: offsetLeft, // 元素相对文档左边距
            top: offsetTop, // 元素相对文档上边距
            right: offsetRight, // 元素相对文档右边距
            bottom: offsetBottom, // 元素相对文档下边距
            width: width, // 元素宽度
            height: height // 元素高度
        }
    }

    return getElementBoundary;

}));