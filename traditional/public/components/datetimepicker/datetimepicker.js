/**
 * 日期时间选择器
 * @requires laydate v5.0.9
 * @link http://www.layui.com/laydate/
 * 
 * @author J.Soon <serdeemail@gmail.com>
 */
(function (root, factory) {
    // 组件名称
    var comPrefix = 'com_'; // 前缀
    var comName = 'datetimepicker'; // 名称
    var globalName = comPrefix + comName; // 全局名称

    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        // Defines a module "amdWebGlobal" that depends another module called "b".
        define(['./laydate'], function (laydate) {
            // Also create a global in case some scripts
            // that are loaded still are looking for
            // a global even when an AMD loader is in use.
            return (root[globalName] = factory(laydate));
        });
    } else {
        // Browser globals
        root[globalName] = factory(root.laydate);
    }
}(typeof self !== 'undefined' ? self : this, function (laydate) {

    return laydate.render;

}));