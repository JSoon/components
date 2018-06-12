/**
 * 分页器
 * 
 * 逻辑：
 * 1. 始终显示第一页和最后一页的页码
 * 2. 显示当前页码前后至多两个页码
 * 例如，1...4 5 6 7 8...20
 * 其中，6为当前页码，显示前后至多两个页码即，4 5 7 8
 * 若当前页码为4，则分页器显示为，1 2 3 4 5 6...20
 * 
 * @author J.Soon <serdeemail@gmail.com>
 */
(function (root, factory) {
    // 组件名称
    var comPrefix = 'com_'; // 前缀
    var comName = 'pagination'; // 名称
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
}(typeof self !== 'undefined' ? self : this, function () {

    /**
     * 分页器
     * 
     * @param {object|json} opts 
     * @param {string}      opts.id          分页器容器id
     * @param {number}      opts.total       总页数
     * @param {number}      opts.current     当前页码
     * @param {number}      opts.round       页码半径，即当前页码前/后能显示的最大页码数量
     * @param {boolean}     opts.noPage      是否生成页码，默认为true；若为false，则只生成上一页和下一页，没有页码
     * @param {function}    opts.onInit      页码初始化回调函数
     * @param {function}    opts.onPageClick 页码点击回调函数
     */
    /**
     * opts.onPageClick
     * @param   {number}    pageNumber  当前点击的页码
     * @param   {object}    event       jQuery event
     * @return  {boolean|promise}       true, false或者promise对象，从而决定是否渲染当前点击页码
     */
    function pagination(opts) {
        var that = {};
        var pager = document.getElementById(opts.id); // 分页器容器id
        var noPage = opts.noPage || false; // 是否生成页码
        var total = opts.total > 0 ? opts.total : 1; // 总页数
        var current = opts.current || 1; // 当前页码
        var pageRound = opts.round; // 页码半径
        // 若opts.round未配置，则默认页面半径为2
        if (pageRound === undefined) {
            pageRound = 2;
        }
        var pageArray = []; // 分页器数组，长度不超过9（即最大为1...3 4 5 6 7...9，其中省略号代替2 8的位置）

        // 页码数据结构体（对于一个页码，只存在下列其一）
        // 普通页码：
        // {
        //     pageNo: 2,
        //     active: false
        // }
        // 省略号：
        // {
        //     ellipsis: true
        // }
        // 上一页：
        // {
        //     prevPageNo: 1,
        //     prev: true
        // }
        // 下一页页：
        // {
        //     nextPageNo: 3,
        //     next: true
        // }

        that.init = init();

        // 初始化分页器
        function init() {
            // 如果是页码分页器
            if (!noPage) {
                pageArray = initPageArray(current, total, pageRound);
                renderPagination(pageArray);
            }
            // 如果是非页码分页器
            else {
                pageArray = initNoPageArray(current);
                renderPagination(pageArray);
            }
            // 页码初始化后触发的回调函数
            typeof opts.onInit === 'function' && opts.onInit();
        }

        // 页码点击事件
        $(pager).off('click', 'li'); // 初始化前先解绑click事件，防止事件重复绑定
        $(pager).on('click', 'li', function (e) {
            e.preventDefault();

            var isActive = $(this).hasClass('active'); // 当前处于激活状态的页码
            var curNumber = parseInt($(this).attr('data-pn')); // 当前页码号
            var shouldTurn = true; // 是否应该翻页（即切换页码，由onPageClick回调返回值决定，默认true）

            /**
             * 不可点击情况：
             * 1. 点击的页码为当前页码
             * 2. 点击的是省略号
             * 3. 当前为第一页时的上一页按钮
             * 4. 当前为最后一页时的下一页按钮
             */
            if (isActive || !curNumber) {
                return;
            }

            if (!noPage) {
                pageArray = initPageArray(curNumber, total, pageRound);
            } else {
                pageArray = initNoPageArray(curNumber);
            }

            // 页码点击时触发的回调函数
            if (typeof opts.onPageClick === 'function') {
                shouldTurn = opts.onPageClick(curNumber, e) || shouldTurn;
                // 若onPageClick返回一个promise对象，则进行异步渲染
                if (typeof shouldTurn.then === 'function') {
                    shouldTurn.then(function (response) {
                        // promise resolved
                        if (response) {
                            renderPagination(pageArray);
                        }
                    }, function () {
                        // promise failed
                    });
                }
                // 若onPageClick为同步执行函数，则进行同步渲染
                else {
                    if (shouldTurn) {
                        renderPagination(pageArray);
                    }
                }
            }
        });

        that.initNoPageArray = initNoPageArray;

        /**
         * 生成只有上一页和下一页的数组
         * @param {number} current 当前页码
         * return {array}          分页器数组   
         */
        function initNoPageArray(current) {
            var prev,
                next;
            if (current !== 1) {
                prev = {
                    prevPageNo: current - 1,
                    prev: true
                };
            } else {
                prev = {
                    prevPageNo: current,
                    prev: false
                };
            }
            next = {
                nextPageNo: current + 1,
                next: true
            };
            return pageArray = [prev, next];
        }

        that.initPageArray = initPageArray;

        /**
         * 生成页码数组
         * @param {number} current  当前页码
         * @param {number} total    总页数 
         * @param {number} round    页码半径，即当前页码前/后能显示的最大页码数量
         * return {array}           分页器数组                  
         */
        function initPageArray(current, total, pageRound) {

            var pagePart1 = []; // 当前分页器数组的左半截
            var pagePart2 = []; // 当前分页器数组的右半截

            // 判断当前页码右半径范围，例如：
            // 若当前页码至最后一页还有至少3页的距离，则生成后两个页码
            // 若大于3，则还要加上省略号，若等于3，则不加
            // 最后生成最后一页的页码
            var roundRight = total - current;
            // 若当前页右半径范围大于等于3，则生成后两页，
            // 同时若右半径范围大于3，则还要生成省略号
            if (roundRight >= pageRound + 1) {
                for (var i = 0; i < pageRound; i += 1) {
                    pagePart2.push({
                        pageNo: current + i + 1,
                        active: false
                    });
                }
                if (roundRight > pageRound + 1) {
                    pagePart2.push({
                        ellipsis: true
                    });
                }
            }
            // 若当前页右半径范围等于页码半径且不等于1，则生成后页码半径数量的页码
            else if (roundRight === pageRound && roundRight > 1) {
                pagePart2.push({
                    pageNo: current + 1,
                    active: false
                });
            }
            // 若当前页不是最后一页，则生成最后一页
            if (roundRight !== 0) {
                pagePart2.push({
                    pageNo: total,
                    active: false
                });
            }
            // 始终生成下一页按钮
            pagePart2.push({
                nextPageNo: current + 1,
                next: true
            });

            // 判断当前页码左半径范围，例如：
            // 若当前页码至第一页还有至少3页的距离，则生成前两个页码
            // 若大于3，则还要加上省略号，若等于3，则不加
            // 最后生成第一页的页码
            var roundLeft = current - 1;
            // 始终生成上一页按钮
            pagePart1.push({
                prevPageNo: current - 1,
                prev: true
            });
            // 若当前页不是第一页，则生成第一页
            if (roundLeft !== 0) {
                pagePart1.push({
                    pageNo: 1,
                    active: false
                });
            }
            // 若当前页左半径范围大于等于3，则生成前两页，
            // 同时若左半径范围大于3，则还要生成省略号
            if (roundLeft >= pageRound + 1) {
                if (roundLeft > pageRound + 1) {
                    pagePart1.push({
                        ellipsis: true
                    });
                }
                for (var j = pageRound; j > 0; j -= 1) {
                    pagePart1.push({
                        pageNo: current - j,
                        active: false
                    });
                }
            }
            // 若当前页左半径范围等于页码半径且不等于1，则生成前页码半径数量的页码
            else if (roundLeft === pageRound && roundLeft > 1) {
                pagePart1.push({
                    pageNo: current - 1,
                    active: false
                });
            }

            // 最后生成分页器数组 = pagePart1 + 当前页码 + pagePart2
            return pageArray = pagePart1.concat([{
                pageNo: current,
                active: true
            }]).concat(pagePart2);
        }

        that.renderPagination = renderPagination;

        /**
         * 渲染pageArray到dom
         * 
         * @param {array|json} pageArray 
         */
        function renderPagination(pageArray) {
            var tmpl = typeof window.paginationTemplate !== 'undefined' ? window.paginationTemplate : require('./pagination.pug');
            pager.innerHTML = tmpl({
                pageArray: pageArray,
                opts: opts
            });
        }
    }

    return pagination;

}));