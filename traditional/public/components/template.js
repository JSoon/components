/**
 * template
 * 
 * @description template
 * @author J.Soon <serdeemail@gmail.com>
 */
(function (root, factory) {
    // 组件名称
    var comPrefix = 'com_'; // 前缀
    var comName = 'template'; // 名称
    var globalName = comPrefix + comName; // 全局名称

    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        // Defines a module "amdWebGlobal" that depends another module called "b".
        define([], function () {
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
}(typeof self !== 'undefined' ? self : this, function () {

    /**
     * @description 
     * 
     * @param {any} opts 
     */
    function template(opts) {

    }

    return template;

}));