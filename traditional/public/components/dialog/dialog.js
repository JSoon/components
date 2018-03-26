/**
 * 弹出式对话框
 * 
 * @author J.Soon <serdeemail@gmail.com>
 */

(function (root, factory) {
    // 组件名称
    var comPrefix = 'com_'; // 前缀
    var comName = 'dialog'; // 名称
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
     * 弹出式对话框
     */
    function dialog() {
        // 对外暴露接口
        var that = {};

        /**
         * 弹出式对话框
         * @param   {object}    opts             
         * @param   {function}  opts.template   前端模板函数
         * @param   {string}    opts.className  自定义className
         * @param   {number}    opts.width      自定义宽度，单位像素，默认400
         * @param   {number}    opts.height     自定义高度，单位像素
         * @param   {string}    opts.title      对话框头部title部分
         * @param   {string}    opts.body       对话框内容body部分
         * @param   {string}    opts.footer     对话框内容footer部分
         * @param   {boolean}   opts.overlay    点击overlay区域是否关闭对话框，默认true
         * 公共事件
         * @param   {function}  opts.onCreate   创建对话框回调函数
         * @param   {function}  opts.onRemove   移除对话框回调函数
         * 确认对话框事件
         * @param   {function}  opts.onConfirm  确认按钮回调函数
         */
        function dialog(opts) {
            opts = opts || {};
            opts.width = opts.width || 400;
            opts.overlay = opts.overlay === false ? false : true;
            // // 加载前端模板
            // // dialogTemplate为预编译后的模板函数，若没有，则采用AMD的方式进行装载（需要使用AMD加载器或者使用webpack）
            // var tmpl = typeof window.dialogTemplate !== 'undefined' ? window.dialogTemplate : require('./dialog.pug');
            // 编译template为html字符串
            var $html = $(opts.template(opts));
            // 添加到页面
            $('body').append($html);

            // 对话框各部分元素
            var $dialog = $html.find('.dialog');
            var $header = $html.find('.dialog-header');
            var $close = $html.find('.J_DialogClose');
            var $body = $html.find('.dialog-body');
            var $footer = $html.find('.dialog-footer');

            // 设置对话框宽高
            $dialog.css({
                width: opts.width
            });
            if (opts.height && (opts.height >= $header.height())) {
                $body.css({
                    height: opts.height - $header.height()
                });
            }

            //#region 对话框高度大于文档可视区域高度适配
            // 若文档可视区域高度大于对话框高度，则正常居中显示
            if (document.documentElement.clientHeight > $dialog.height()) {
                alignCenter($dialog);
            }
            // 否则，进行样式适配
            else {
                $html.addClass('overflow');
            }
            //#endregion

            // 创建对话框回调函数
            typeof opts.onCreate === 'function' && opts.onCreate($dialog);

            // 点击关闭按钮或者对话框之外的overlay遮罩部分，销毁对话框
            $html.on('click', function (e) {
                if (e.target.getAttribute('class').indexOf('J_DialogClose') !== -1) {
                    closeDialog($html);
                }
                if (opts.overlay && e.currentTarget === e.target) {
                    closeDialog($html);
                }
            });

            /**
             * 关闭对话框，并移除DOM节点
             * @param {object} overlay 对话框父容器jquery对象
             */
            function closeDialog(overlay) {
                // 移除对话框回调函数
                typeof opts.onRemove === 'function' && opts.onRemove($dialog);
                var duration = 200; // 移除对话框时间，与移除动画持续时间相同
                overlay.addClass('removing'); // 添加移除中动画
                setTimeout(function () {
                    overlay.remove();
                }, duration);
                return overlay;
            }

            /**
             * 对话框垂直居中布局
             * @param {object} dialog 对话框容器jquery对象
             */
            function alignCenter(dialog) {
                var width = dialog.width();
                var height = dialog.height();
                dialog.css({
                    top: '50%',
                    left: '50%',
                    marginLeft: -width / 2,
                    marginTop: -height / 2
                });
                return dialog;
            }

            return $dialog;
        }

        that.normal = normal;
        /**
         * 普通对话框
         * @description 可用于包含任何交互结构与信息的对话框
         */
        function normal(opts) {
            // 加载前端模板
            // dialogTemplate为预编译后的模板函数，若没有，则采用AMD的方式进行装载（需要使用AMD加载器或者使用webpack）
            var tmpl = typeof window.dialogTemplate !== 'undefined' ? window.dialogTemplate : require('./dialog.pug');
            opts.template = tmpl;
            try {
                var $normalDialog = dialog(opts);
            } catch (err) {
                console.error(err);
            }
        }

        that.confirm = confirm;
        /**
         * 确认对话框
         * @description 包含确认和取消交互按钮的对话框
         */
        function confirm(opts) {
            // 加载前端模板
            // confirmTemplate为预编译后的模板函数，若没有，则采用AMD的方式进行装载（需要使用AMD加载器或者使用webpack）
            var tmpl = typeof window.confirmTemplate !== 'undefined' ? window.confirmTemplate : require('./confirm.pug');
            opts.template = tmpl;
            try {
                var $confirmDialog = dialog(opts);
            } catch (err) {
                console.error(err);
            }
            // 确认按钮
            $confirmDialog.find('.J_DialogConfirm').on('click', function () {
                typeof opts.onConfirm === 'function' && opts.onConfirm($confirmDialog);
            });
        }

        that.toast = toast;
        /**
         * 简单信息提示
         * @description 没有任何交互性的提示性对话框
         * @param {string}  content    提示内容
         * @param {number}  duration   内容显示时间
         */
        function toast(content, duration) {
            // 加载前端模板
            // toastTemplate为预编译后的模板函数，若没有，则采用AMD的方式进行装载（需要使用AMD加载器或者使用webpack）
            var tmpl = typeof window.toastTemplate !== 'undefined' ? window.toastTemplate : require('./toast.pug');
            // 编译为html字符串，并转换成jquery对象
            var $html = $(tmpl({
                content: content
            }));
            // 添加到页面
            $('body').append($html);

            // 设置内容消失时间
            var duration = duration || 2000;
            setTimeout(function () {
                var duration = 200; // 移除对话框时间，与移除动画持续时间相同
                $html.addClass('removing'); // 添加移除中动画
                setTimeout(function () {
                    $html.remove();
                }, duration);
            }, duration);
        }

        return that;
    }

    return dialog;

}));