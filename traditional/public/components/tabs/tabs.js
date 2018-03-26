/**
 * 选项卡导航
 * 
 * @author J.Soon <serdeemail@gmail.com>
 */
(function (root, factory) {
    // 组件名称
    var comPrefix = 'com_'; // 前缀
    var comName = 'tabs'; // 名称
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
     * 选项卡导航
     * @param {object}     opts
     * @param {string}     opts.id           选项卡导航id
     * @param {string}     opts.active       默认显示的选项卡id
     * @param {function}   opts.onTabClick   切换选项卡事件
     * 固定DOM结构如下：
     * 1. 静态切换（多个标签对应多个内容容器）
     * <nav class="tabs-nav">
         <a href="#tab1" class="active">tab1</a>
         <a href="#tab2">tab2</a>
         <a href="#tab3">tab3</a>
         </nav>
         ... // 其他内容
         <div class="tabs-content">
         <div id="tab1">
         </div>
         <div id="tab2">
         </div>
         <div id="tab3">
         </div>
         </div>
     * 2. 动态切换（多个标签仅对应一个内容容器，通过ajax来更新内容）
     * <nav class="tabs-nav">
         <a href="#tab" class="active">tab1</a>
         <a href="#tab">tab2</a>
         <a href="#tab">tab3</a>
         </nav>
         ... // 其他内容
         <div class="tabs-content">
         <div id="tab">
         </div>
         </div>
     */
    /**
     * onTabClick
     * @param {object} tab      标签jQuery对象
     * @param {object} content  内容容器jQuery对象
     */
    function tabNav(opts) {
        var tabNav = $('#' + opts.id);
        var links = tabNav.find('a');
        var firstLink = $(links[0]);

        opts = opts || {};
        // 设置默认显示，默认为显示第一个选项卡内容
        if (!opts.active) {
            opts.active = firstLink.attr('href');
        } else {
            opts.active = '#' + opts.active;
        }
        // 高亮激活项选项卡
        tabNav.find('a[href="' + opts.active + '"]').eq(0).addClass('active').siblings().removeClass('active');
        $(opts.active).show();

        // 切换选项卡事件
        tabNav.on('click', 'a', function (e) {
            e.preventDefault();
            var tab = $(this);
            links.removeClass('active'); // 清除所有选项卡高亮
            tab.addClass('active'); // 给当前点击的选项卡添加高亮
            var contentId = tab.attr('href');
            $(contentId).show().siblings().hide();
            // 选项卡切换回调函数，参数为当前显示的内容容器
            typeof opts.onTabClick === 'function' && opts.onTabClick(tab, $(contentId));
        });
    }

    return tabNav;

}));