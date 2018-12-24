/**
 * 分享到组件
 * 
 * @description 分享网址到各个社交平台
 * @author J.Soon <serdeemail@gmail.com>
 */
(function (root, factory) {
    // 组件名称
    var comPrefix = 'com_'; // 前缀
    var comName = 'shareTo'; // 名称
    var globalName = comPrefix + comName; // 全局名称

    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        // Defines a module "amdWebGlobal" that depends another module called "b".
        // 二维码生成器：https://github.com/davidshimjs/qrcodejs
        define(['./qrcodejs/qrcode.js'], function (QRCode) {
            // Also create a global in case some scripts
            // that are loaded still are looking for
            // a global even when an AMD loader is in use.
            return (root[globalName] = factory(QRCode));
        });
    } else {
        // Browser globals
        // root[globalName] = factory(root.b);
        root[globalName] = factory(root.QRCode);
    }
}(typeof self !== 'undefined' ? self : this, function (QRCode) {

    /**
     * @description 分享到组件
     * 
     * @param   {object}    opts                分享参数
     * @param   {string}    opts.selector       分享组件容器选择器
     * @param   {object}    opts.shareUrls      分享社交平台请求地址，不包含参数
     * @param   {object}    opts.platforms      分享社交平台开关，默认全部开启
     * @param   {string}    opts.trigger        分享到微信，二维码出现触发事件，click - 鼠标点击触发，hover - 鼠标停留触发，默认click
     * @param   {string}    opts.url            分享网页地址
     * @param   {string}    opts.title          分享标题
     * @param   {string}    opts.desc           分享描述（当分享到微博时，将该值设为title参数的值）
     * @param   {string}    opts.summary        ?（暂不清楚用途，可空）
     * @param   {string}    opts.flash          ?（暂不清楚用途，可空）
     * @param   {string}    opts.pics           分享图片：（QQ好友、QQ空间分享时，多张用|分隔；微博分享时，多张用||分隔）
     * @param   {string}    opts.site           分享网站名称
     * @param   {string}    opts.callback       分享成功回调请求地址：（貌似可用于分享成功后的上报，待验证）
     * @param   {string}    opts.showcount      点赞用户显示数量（暂不清楚用途，默认传0）
     */
    function shareTo(opts) {

        opts = opts || {};

        /**
         * 分享社交平台请求地址
         */
        var SHARE_URLS = $.extend({
            qq: 'http://connect.qq.com/widget/shareqq/index.html?', // qq
            qzone: 'https://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey?', // qq空间
            wechat: '', // 无，分享到微信只需要分享网页地址的二维码
            weibo: 'http://service.weibo.com/share/share.php?' // 微博
        }, opts.shareUrls || {});

        /**
         * 分享社交平台开关，默认全部开启
         */
        var platforms = $.extend({
            qq: true, // qq
            qzone: true, // qq空间
            weibo: true, // 微博
            wechat: true // 微信
        }, opts.platforms || {});

        /**
         * 分享参数
         * @description
         * 分享给QQ好友作用参数有：
         * opts.url, opts.title, opts.desc, opts.summary, opts.flash, opts.pics, opts.site, opts.callback
         * 分享到QQ空间作用参数有：
         * opts.url, opts.title, opts.desc, opts.summary, opts.showcount, opts.pics, opts.site, opts.callback
         * 分享到微博作用参数有：
         * opts.url, opts.title, opts.pic
         */
        var shareConfigs = {
            url: opts.url || '', // 分享网页地址
            title: opts.title || '', // 分享标题
            desc: opts.desc || '', // 分享描述（当分享到微博时，该值为title参数的值）
            summary: opts.summary || '', // ??（暂不清楚用途，可空）
            flash: opts.flash || '', // ??（暂不清楚用途，可空）
            pic: opts.pics || [], // 分享图片（微博分享使用，多张用||分隔）
            pics: opts.pics || [], // 分享图片（QQ好友、QQ空间分享使用，多张用|分隔）
            site: opts.site || '', // 分享网站名称
            callback: opts.callback || '', // 分享成功回调请求地址：（貌似可用于分享成功后的上报，待验证）
            showcount: opts.showcount || '0', // 点赞用户显示数量（暂不清楚用途，默认传0）
            // 参考文档：https://github.com/davidshimjs/qrcodejs
            qrcode: opts.qrcode || {} // 二维码生成器配置对象
        };

        var shareToClassName = opts.className || 'com-share-to';
        var $shareToGroup = $('<div></div>').addClass(shareToClassName);
        var $shareToQQ = $('<a class="share-to-qq" target="_blank">分享给QQ好友</a>');
        var $shareToQZone = $('<a class="share-to-qzone" target="_blank">分享到QQ空间</a>');
        var $shareToWeChat = $('<a class="share-to-wechat"><span class="share-to-wechat-trigger">分享到微信</span></a>');
        var $shareToWeibo = $('<a class="share-to-weibo" target="_blank">分享到微博</a>');
        // 分享地址二维码（分享到微信用）
        var $shareQRCode = $('<div class="share-to-wechat-qrcode" style="display: none;"></div>');
        var shareQRCodeOpts;
        // 分享参数数组
        var shareToQQ = [],
            shareToQZone = [],
            shareToWeibo = [];

        /**
         * 设置各平台分享地址
         */
        // 分享给QQ好友
        if (platforms.qq) {
            shareToQQ.push('url=' + shareConfigs.url);
            shareToQQ.push('title=' + shareConfigs.title);
            shareToQQ.push('desc=' + shareConfigs.desc);
            shareToQQ.push('summary=' + shareConfigs.summary);
            shareToQQ.push('flash=' + shareConfigs.flash);
            shareToQQ.push('pics=' + shareConfigs.pics.join('|'));
            shareToQQ.push('site=' + shareConfigs.site);
            shareToQQ.push('callback=' + shareConfigs.callback);

            shareToQQ = shareToQQ.join('&');

            $shareToQQ.attr('href', SHARE_URLS.qq + shareToQQ);
            $shareToGroup.append($shareToQQ);
        }
        // 分享到QQ空间
        if (platforms.qzone) {
            shareToQZone.push('url=' + shareConfigs.url);
            shareToQZone.push('title=' + shareConfigs.title);
            shareToQZone.push('desc=' + shareConfigs.desc);
            shareToQZone.push('summary=' + shareConfigs.summary);
            shareToQZone.push('showcount=' + shareConfigs.showcount);
            shareToQZone.push('pics=' + shareConfigs.pics.join('|'));
            shareToQZone.push('site=' + shareConfigs.site);
            shareToQZone.push('callback=' + shareConfigs.callback);

            shareToQZone = shareToQZone.join('&');

            $shareToQZone.attr('href', SHARE_URLS.qzone + shareToQZone);
            $shareToGroup.append($shareToQZone);
        }
        // 分享到微信
        if (platforms.wechat) {
            //#region 生成分享地址二维码
            shareQRCodeOpts = $.extend({
                text: shareConfigs.url,
                width: 128,
                height: 128,
                colorDark: '#000000', // 二维码前景色
                colorLight: '#ffffff', // 二维码背景色
                correctLevel: QRCode.CorrectLevel.H
            }, shareConfigs.qrcode);
            new QRCode($shareQRCode.get(0), shareQRCodeOpts);
            // 设置二维码容器尺寸，避免useSVG模式下尺寸失效
            $shareQRCode.css({
                width: shareQRCodeOpts.width,
                height: shareQRCodeOpts.height
            });
            // 设置不支持canvas和svg浏览器下，table的样式
            $shareQRCode.children('table').css({
                margin: 0,
                width: shareQRCodeOpts.width,
                height: shareQRCodeOpts.height
            });
            $shareToWeChat.append($shareQRCode);
            //#endregion

            $shareToGroup.append($shareToWeChat);

            //#region 绑定微信分享二维码出现事件
            opts.trigger = opts.trigger || 'click';
            if (opts.trigger === 'click') {
                $shareToWeChat.find('.share-to-wechat-trigger').on(opts.trigger, function () {
                    $shareQRCode.toggle();
                });

                // 点击二维码以外的位置，进行隐藏
                $(document).on('click', function (e) {
                    if (!$(e.target).parents('.share-to-wechat').length) {
                        $shareQRCode.hide();
                    }
                });
            } else if (opts.trigger === 'hover') {
                $shareToWeChat
                    .on('mouseenter', function () {
                        $shareQRCode.show();
                    })
                    .on('mouseleave', function () {
                        $shareQRCode.hide();
                    });
            }
            //#endregion
        }
        // 分享到微博
        if (platforms.weibo) {
            shareToWeibo.push('url=' + shareConfigs.url);
            // 分享到微博只有title参数，没有desc参数，故取desc的值作为分享文本内容
            shareToWeibo.push('title=' + shareConfigs.desc);
            shareToWeibo.push('pic=' + shareConfigs.pic.join('||'));

            shareToWeibo = shareToWeibo.join('&');

            $shareToWeibo.attr('href', SHARE_URLS.weibo + shareToWeibo);
            $shareToGroup.append($shareToWeibo);
        }

        // 添加各平台分享按钮到分享组件容器
        $(opts.selector).append($shareToGroup);

    }

    return shareTo;

}));