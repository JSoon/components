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
}(typeof self !== 'undefined' ? self : this, function (b) {

    /**
     * 分页器
     * 
     * @param {object|json} options 
     * @param {string}      options.id          分页器容器id
     * @param {number}      options.total       总页数
     * @param {number}      options.current     当前页码
     * @param {number}      options.round       页码半径，即当前页码前/后能显示的最大页码数量
     * @param {boolean}     options.noPage      是否生成页码，默认为true；若为false，则只生成上一页和下一页，没有页码
     * @param {function}    options.onInit      页码初始化回调函数
     * @param {function}    options.onPageClick 页码点击回调函数
     */
    /**
     * options.onPageClick
     * @param {number} pageNumber   当前点击的页码
     * @param {object} event        jQuery event
     */
    function pagination(options) {
        var that = {};
        var pager = document.getElementById(options.id); // 分页器容器id
        var noPage = options.noPage || false; // 是否生成页码
        var total = options.total > 0 ? options.total : 1; // 总页数
        var current = options.current || 1; // 当前页码
        var pageRound = options.round || 2; // 页码半径
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
                pageArray = initPageArray(current, total);
                renderPagination(pageArray);
            }
            // 如果是非页码分页器
            else {
                pageArray = initNoPageArray(current);
                renderPagination(pageArray);
            }
            // 页码初始化后触发的回调函数
            typeof options.onInit === 'function' && options.onInit();
        }

        // 页码点击事件
        $(pager).off('click', 'li'); // 初始化前先解绑click事件，防止事件重复绑定
        $(pager).on('click', 'li', function (e) {
            e.preventDefault();

            var isActive = $(this).hasClass('on'); // 当前处于激活状态的页码
            var curNumber = parseInt($(this).attr('data-pn')); // 当前页码号

            if (isActive || !curNumber) {
                return;
            }

            if (!noPage) {
                pageArray = initPageArray(curNumber, total);
            } else {
                pageArray = initNoPageArray(curNumber);
            }

            // 页码点击时触发的回调函数
            typeof options.onPageClick === 'function' && options.onPageClick(curNumber, e);

            renderPagination(pageArray);
        });

        that.initNoPageArray = initNoPageArray;

        /**
         * 生成只有上一页和下一页的数组
         * @param {number} current 当前页码
         * return {array}           分页器数组   
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
        function initPageArray(current, total, round) {

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
            else if (roundRight === pageRound && roundRight !== 1) {
                pagePart2.push({
                    pageNo: current + 1,
                    active: false
                });
            }
            // 若当前页不是最后一页，则生成最后一页；同时生成下一页按钮
            if (roundRight !== 0) {
                pagePart2.push({
                    pageNo: total,
                    active: false
                });
                pagePart2.push({
                    nextPageNo: current + 1,
                    next: true
                });
            }

            // 判断当前页码左半径范围，例如：
            // 若当前页码至第一页还有至少3页的距离，则生成前两个页码
            // 若大于3，则还要加上省略号，若等于3，则不加
            // 最后生成第一页的页码
            var roundLeft = current - 1;
            // 若当前页不是第一页，则生成第一页；同时生成上一页按钮
            if (roundLeft !== 0) {
                pagePart1.push({
                    prevPageNo: current - 1,
                    prev: true
                });
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
                for (var i = pageRound; i > 0; i -= 1) {
                    pagePart1.push({
                        pageNo: current - i,
                        active: false
                    });
                }
            }
            // 若当前页左半径范围等于页码半径且不等于1，则生成前页码半径数量的页码
            else if (roundRight === pageRound && roundRight !== 1) {
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
            var html = ''; // 分页器html字符串
            for (var i = 0; i < pageArray.length; i += 1) {
                // 生成上一页按钮
                if (pageArray[i].prev) {
                    html += '<li data-pn="' + pageArray[i].prevPageNo + '"><a class="prev" href="#">' + (options.prevText || '&lt;') + '</a></li>';
                }
                // 生成页码
                if (typeof pageArray[i].pageNo === 'number') {
                    if (!pageArray[i].active) {
                        html += '<li data-pn="' + pageArray[i].pageNo + '"><a href="#">' + pageArray[i].pageNo + '</a></li>';
                    } else {
                        html += '<li class="active" data-pn="' + pageArray[i].pageNo + '"><span class="current">' + pageArray[i].pageNo + '</span></li>';
                    }
                }
                // 生成省略号
                else if (pageArray[i].ellipsis) {
                    html += '<li class="disabled"><span class="ellipse">...</span></li>';
                }
                // 生成下一页按钮
                if (pageArray[i].next) {
                    html += '<li data-pn="' + pageArray[i].nextPageNo + '"><a class="next" href="#">' + (options.nextText || '&gt;') + '</a></li>';
                }
            }
            pager.innerHTML = '<ul>' + html + '</ul>';
        }
    }

    return pagination;

}));