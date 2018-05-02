function pug_attr(t,e,n,f){return e!==!1&&null!=e&&(e||"class"!==t&&"style"!==t)?e===!0?" "+(f?t:t+'="'+t+'"'):("function"==typeof e.toJSON&&(e=e.toJSON()),"string"==typeof e||(e=JSON.stringify(e),n||e.indexOf('"')===-1)?(n&&(e=pug_escape(e))," "+t+'="'+e+'"'):" "+t+"='"+e.replace(/'/g,"&#39;")+"'"):""}
function pug_escape(e){var a=""+e,t=pug_match_html.exec(a);if(!t)return e;var r,c,n,s="";for(r=t.index,c=0;r<a.length;r++){switch(a.charCodeAt(r)){case 34:n="&quot;";break;case 38:n="&amp;";break;case 60:n="&lt;";break;case 62:n="&gt;";break;default:continue}c!==r&&(s+=a.substring(c,r)),c=r+1,s+=n}return c!==r?s+a.substring(c,r):s}
var pug_match_html=/["&<>]/;function paginationTemplate(locals) {var pug_html = "", pug_mixins = {}, pug_interp;var pageArray = locals.pageArray;
var opts = locals.opts;

if (pageArray && pageArray.length) {
pug_html = pug_html + "\u003Cul\u003E";
// iterate pageArray
;(function(){
  var $$obj = pageArray;
  if ('number' == typeof $$obj.length) {
      for (var index = 0, $$l = $$obj.length; index < $$l; index++) {
        var page = $$obj[index];
if (page.prev) {
var firstPage = 1;
if (page.prevPageNo < firstPage) {
pug_html = pug_html + "\u003Cli class=\"disabled\"\u003E\u003Cspan" + (" class=\"prev\""+pug_attr("title", opts.prevText || "上一页", true, false)) + "\u003E" + (pug_escape(null == (pug_interp = opts.prevText || "<") ? "" : pug_interp)) + "\u003C\u002Fspan\u003E\u003C\u002Fli\u003E";
}
else {
pug_html = pug_html + "\u003Cli" + (pug_attr("data-pn", page.prevPageNo, true, false)) + "\u003E\u003Ca" + (" class=\"prev\""+" href=\"#\""+pug_attr("title", opts.prevText || "上一页", true, false)) + "\u003E" + (pug_escape(null == (pug_interp = opts.prevText || "<") ? "" : pug_interp)) + "\u003C\u002Fa\u003E\u003C\u002Fli\u003E";
}
}
if (typeof page.pageNo === "number") {
if (!page.active) {
pug_html = pug_html + "\u003Cli" + (pug_attr("data-pn", page.pageNo, true, false)) + "\u003E\u003Ca href=\"#\"\u003E" + (pug_escape(null == (pug_interp = page.pageNo) ? "" : pug_interp)) + "\u003C\u002Fa\u003E\u003C\u002Fli\u003E";
}
else {
pug_html = pug_html + "\u003Cli" + (" class=\"active\""+pug_attr("data-pn", page.pageNo, true, false)) + "\u003E\u003Cspan class=\"current\"\u003E" + (pug_escape(null == (pug_interp = page.pageNo) ? "" : pug_interp)) + "\u003C\u002Fspan\u003E\u003C\u002Fli\u003E";
}
}
else
if (page.ellipsis) {
pug_html = pug_html + "\u003Cli class=\"disabled\"\u003E\u003Cspan class=\"ellipse\"\u003E...\u003C\u002Fspan\u003E\u003C\u002Fli\u003E";
}
if (page.next) {
var lastPage = pageArray[pageArray.length - 2].pageNo;
if (page.nextPageNo > lastPage) {
pug_html = pug_html + "\u003Cli class=\"disabled\"\u003E\u003Cspan" + (" class=\"next\""+pug_attr("title", opts.nextText || "下一页", true, false)) + "\u003E" + (pug_escape(null == (pug_interp = opts.nextText || ">") ? "" : pug_interp)) + "\u003C\u002Fspan\u003E\u003C\u002Fli\u003E";
}
else {
pug_html = pug_html + "\u003Cli" + (pug_attr("data-pn", page.nextPageNo, true, false)) + "\u003E\u003Ca" + (" class=\"next\""+" href=\"#\""+pug_attr("title", opts.nextText || "下一页", true, false)) + "\u003E" + (pug_escape(null == (pug_interp = opts.nextText || ">") ? "" : pug_interp)) + "\u003C\u002Fa\u003E\u003C\u002Fli\u003E";
}
}
      }
  } else {
    var $$l = 0;
    for (var index in $$obj) {
      $$l++;
      var page = $$obj[index];
if (page.prev) {
var firstPage = 1;
if (page.prevPageNo < firstPage) {
pug_html = pug_html + "\u003Cli class=\"disabled\"\u003E\u003Cspan" + (" class=\"prev\""+pug_attr("title", opts.prevText || "上一页", true, false)) + "\u003E" + (pug_escape(null == (pug_interp = opts.prevText || "<") ? "" : pug_interp)) + "\u003C\u002Fspan\u003E\u003C\u002Fli\u003E";
}
else {
pug_html = pug_html + "\u003Cli" + (pug_attr("data-pn", page.prevPageNo, true, false)) + "\u003E\u003Ca" + (" class=\"prev\""+" href=\"#\""+pug_attr("title", opts.prevText || "上一页", true, false)) + "\u003E" + (pug_escape(null == (pug_interp = opts.prevText || "<") ? "" : pug_interp)) + "\u003C\u002Fa\u003E\u003C\u002Fli\u003E";
}
}
if (typeof page.pageNo === "number") {
if (!page.active) {
pug_html = pug_html + "\u003Cli" + (pug_attr("data-pn", page.pageNo, true, false)) + "\u003E\u003Ca href=\"#\"\u003E" + (pug_escape(null == (pug_interp = page.pageNo) ? "" : pug_interp)) + "\u003C\u002Fa\u003E\u003C\u002Fli\u003E";
}
else {
pug_html = pug_html + "\u003Cli" + (" class=\"active\""+pug_attr("data-pn", page.pageNo, true, false)) + "\u003E\u003Cspan class=\"current\"\u003E" + (pug_escape(null == (pug_interp = page.pageNo) ? "" : pug_interp)) + "\u003C\u002Fspan\u003E\u003C\u002Fli\u003E";
}
}
else
if (page.ellipsis) {
pug_html = pug_html + "\u003Cli class=\"disabled\"\u003E\u003Cspan class=\"ellipse\"\u003E...\u003C\u002Fspan\u003E\u003C\u002Fli\u003E";
}
if (page.next) {
var lastPage = pageArray[pageArray.length - 2].pageNo;
if (page.nextPageNo > lastPage) {
pug_html = pug_html + "\u003Cli class=\"disabled\"\u003E\u003Cspan" + (" class=\"next\""+pug_attr("title", opts.nextText || "下一页", true, false)) + "\u003E" + (pug_escape(null == (pug_interp = opts.nextText || ">") ? "" : pug_interp)) + "\u003C\u002Fspan\u003E\u003C\u002Fli\u003E";
}
else {
pug_html = pug_html + "\u003Cli" + (pug_attr("data-pn", page.nextPageNo, true, false)) + "\u003E\u003Ca" + (" class=\"next\""+" href=\"#\""+pug_attr("title", opts.nextText || "下一页", true, false)) + "\u003E" + (pug_escape(null == (pug_interp = opts.nextText || ">") ? "" : pug_interp)) + "\u003C\u002Fa\u003E\u003C\u002Fli\u003E";
}
}
    }
  }
}).call(this);

pug_html = pug_html + "\u003C\u002Ful\u003E";
};return pug_html;}