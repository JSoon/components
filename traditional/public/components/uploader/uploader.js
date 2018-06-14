/**
 * 文件上传
 * 
 * fineuploader 5.16.2
 * 插件：https://fineuploader.com/demos.html
 * 文档：https://docs.fineuploader.com/branch/master/api/options.html
 * 
 * @author J.Soon <serdeemail@gmail.com>
 */

(function (root, factory) {
    // 组件名称
    var comPrefix = 'com_'; // 前缀
    var comName = 'uploader'; // 名称
    var globalName = comPrefix + comName; // 全局名称

    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        // Defines a module "amdWebGlobal" that depends another module called "b".
        define(['./fine-uploader/fine-uploader'], function (fineUploader) {
            // Also create a global in case some scripts
            // that are loaded still are looking for
            // a global even when an AMD loader is in use.
            return (root[globalName] = factory(fineUploader));
        });
    } else {
        // Browser globals
        // root[globalName] = factory(root.b);
        var fineUploader = root['qq'];
        root[globalName] = factory(fineUploader);
    }
}(typeof self !== 'undefined' ? self : this, function (qq) {

    /**
     * 文件上传
     * 
     * @param {object}      opts                文件上传配置对象
     * @param {string}      opts.elementId      上传元素id
     * @param {string}      opts.templateId     上传模板id
     * @param {function}    opts.templateTmpl   上传模板渲染函数，如require('.template')，这里不定义为template是为了避免同fine-uploader的配置项名重复
     * @param {string}      opts.maxSize        自定义上传超过最大限制的提示，如 '500MB'
     * @param {*}           opts.*              fineuploader options，见文档
     */
    function uploader(opts) {
        opts = opts || {};
        opts.elementId = opts.elementId || null; // 上传元素id
        if (!opts.elementId) {
            new Error('没有配置上传元素id!');
        }
        opts.templateId = opts.templateId || 'qq-template-validation'; // 模板id

        var template = opts.templateTmpl || defaultTemplate; // 引入上传模板
        var html = template(opts.templateId);

        // 将上传模板添加到页面中
        $('body').append(html);

        var uploaderOpts = $.extend(true, {
            element: document.getElementById(opts.elementId),
            template: opts.templateId,
            thumbnails: {
                placeholders: {
                    waitingPath: './fine-uploader/placeholders/waiting-generic.png',
                    notAvailablePath: './fine-uploader/placeholders/not_available-generic.png'
                }
            },
            // 上传界面中的文本信息
            text: {
                failUpload: '上传失败',
                formatProgress: '已完成 {percent}%，文件总大小 {total_size}',
                paused: '上传暂停',
                waitingForResponse: '上传中...'
            },
            // 上传提示框中的提示信息
            messages: {
                emptyError: '{file} 是空文件，请重新选择上传。',
                maxHeightImageError: '图片超过指定高度，请重新选择上传。',
                maxWidthImageError: '图片超过指定宽度，请重新选择上传。',
                minHeightImageError: '图片未达到指定高度，请重新选择上传。',
                minWidthImageError: '图片未达到指定宽度，请重新选择上传。',
                minSizeError: '{file} 文件过小, 最小允许的文件大小为 {minSizeLimit}。',
                noFilesError: '没有文件可以上传。',
                onLeave: '文件正在上传中，如果此时关闭页面，上传将会失败。',
                retryFailTooManyItemsError: '重新上传失败，您已经达到了最大上传数量限制。',
                sizeError: opts.maxSize ? '{file} 文件过大, 最大允许的文件大小为' + opts.maxSize + '。' : '{file} 文件过大, 最大允许的文件大小为 {sizeLimit}。',
                tooManyItemsError: '上传失败，最大上传数量限制为 {itemLimit}。',
                typeError: '{file} 文件格式错误，合法的文件格式为：{extensions}。'
            }
        }, opts);

        var uploader = new qq.FineUploader(uploaderOpts);

        return uploader;
    }

    /**
     * 默认上传控件HTML模板（无预览）
     * 
     * 如需自定义，请按照该模板进行修改
     * 
     * @author J.Soon <serdeemail@gmail.com>
     * 
     * @param {string} 模板容器id 
     */
    function defaultTemplate(id) {

        var html = '<script type="text/template" id="' + id + '">\
            <div class="qq-uploader-selector qq-uploader" qq-drop-area-text="将文件拖拽到这里">\
                <div class="qq-total-progress-bar-container-selector qq-total-progress-bar-container">\
                    <div role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" class="qq-total-progress-bar-selector qq-progress-bar qq-total-progress-bar"></div>\
                </div>\
                <div class="qq-upload-drop-area-selector qq-upload-drop-area" qq-hide-dropzone>\
                    <span class="qq-upload-drop-area-text-selector"></span>\
                </div>\
                <div class="qq-upload-button-selector qq-upload-button">\
                    <div>选择上传文件</div>\
                </div>\
                    <span class="qq-drop-processing-selector qq-drop-processing">\
                        <span>上传文件处理中...</span>\
                        <span class="qq-drop-processing-spinner-selector qq-drop-processing-spinner"></span>\
                    </span>\
                <ul class="qq-upload-list-selector qq-upload-list" aria-live="polite" aria-relevant="additions removals">\
                    <li>\
                        <div class="qq-progress-bar-container-selector">\
                            <div role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" class="qq-progress-bar-selector qq-progress-bar"></div>\
                        </div>\
                        <span class="qq-upload-spinner-selector qq-upload-spinner"></span>\
                        <span class="qq-upload-file-selector qq-upload-file"></span>\
                        <span class="qq-edit-filename-icon-selector qq-edit-filename-icon" aria-label="Edit filename"></span>\
                        <input class="qq-edit-filename-selector qq-edit-filename" tabindex="0" type="text">\
                        <span class="qq-upload-size-selector qq-upload-size"></span>\
                        <button type="button" class="qq-btn qq-upload-cancel-selector qq-upload-cancel">取&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;消</button>\
                        <button type="button" class="qq-btn qq-upload-retry-selector qq-upload-retry">重&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;试</button>\
                        <button type="button" class="qq-btn qq-upload-delete-selector qq-upload-delete">删&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;除</button>\
                        <span role="status" class="qq-upload-status-text-selector qq-upload-status-text"></span>\
                    </li>\
                </ul>\
                \
                <dialog class="qq-alert-dialog-selector qq-dialog">\
                    <div class="qq-dialog-message-selector"></div>\
                    <div class="qq-dialog-buttons">\
                        <button type="button" class="qq-cancel-button-selector">关&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;闭</button>\
                    </div>\
                </dialog>\
                \
                <dialog class="qq-confirm-dialog-selector qq-dialog">\
                    <div class="qq-dialog-message-selector"></div>\
                    <div class="qq-dialog-buttons">\
                        <button type="button" class="qq-cancel-button-selector cancel">取&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;消</button>\
                        <button type="button" class="qq-ok-button-selector">确&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;认</button>\
                    </div>\
                </dialog>\
                \
                <dialog class="qq-prompt-dialog-selector qq-dialog">\
                    <div class="qq-dialog-message-selector"></div>\
                    <input type="text">\
                    <div class="qq-dialog-buttons">\
                        <button type="button" class="qq-cancel-button-selector cancel">取&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;消</button>\
                        <button type="button" class="qq-ok-button-selector">确&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;认</button>\
                    </div>\
                </dialog>\
            </div>\
        </script>';

        return html;

    }

    return uploader;

}));