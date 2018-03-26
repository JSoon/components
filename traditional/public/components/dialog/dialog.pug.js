function pug_attr(t,e,n,f){return e!==!1&&null!=e&&(e||"class"!==t&&"style"!==t)?e===!0?" "+(f?t:t+'="'+t+'"'):("function"==typeof e.toJSON&&(e=e.toJSON()),"string"==typeof e||(e=JSON.stringify(e),n||e.indexOf('"')===-1)?(n&&(e=pug_escape(e))," "+t+'="'+e+'"'):" "+t+"='"+e.replace(/'/g,"&#39;")+"'"):""}
function pug_classes(s,r){return Array.isArray(s)?pug_classes_array(s,r):s&&"object"==typeof s?pug_classes_object(s):s||""}
function pug_classes_array(r,a){for(var s,e="",u="",c=Array.isArray(a),g=0;g<r.length;g++)s=pug_classes(r[g]),s&&(c&&a[g]&&(s=pug_escape(s)),e=e+u+s,u=" ");return e}
function pug_classes_object(r){var a="",n="";for(var o in r)o&&r[o]&&pug_has_own_property.call(r,o)&&(a=a+n+o,n=" ");return a}
function pug_escape(e){var a=""+e,t=pug_match_html.exec(a);if(!t)return e;var r,c,n,s="";for(r=t.index,c=0;r<a.length;r++){switch(a.charCodeAt(r)){case 34:n="&quot;";break;case 38:n="&amp;";break;case 60:n="&lt;";break;case 62:n="&gt;";break;default:continue}c!==r&&(s+=a.substring(c,r)),c=r+1,s+=n}return c!==r?s+a.substring(c,r):s}
var pug_has_own_property=Object.prototype.hasOwnProperty;
var pug_match_html=/["&<>]/;function dialogTemplate(locals) {var pug_html = "", pug_mixins = {}, pug_interp;;var locals_for_with = (locals || {});(function (body, className, footer, title) {pug_html = pug_html + "\u003Cdiv class=\"dialog-overlay\"\u003E\u003Cdiv" + (pug_attr("class", pug_classes(["dialog","normal",className], [false,false,true]), false, false)) + "\u003E\u003Cdiv class=\"dialog-header\"\u003E\u003Cspan class=\"dialog-title\"\u003E" + (pug_escape(null == (pug_interp = title || '对话框') ? "" : pug_interp)) + "\u003C\u002Fspan\u003E\u003Ci class=\"dialog-close J_DialogClose\"\u003E关闭\u003C\u002Fi\u003E\u003C\u002Fdiv\u003E";
if (body) {
pug_html = pug_html + "\u003Cdiv class=\"dialog-body\"\u003E" + (null == (pug_interp = body) ? "" : pug_interp) + "\u003C\u002Fdiv\u003E";
}
if (footer) {
pug_html = pug_html + "\u003Cdiv class=\"dialog-footer\"\u003E" + (null == (pug_interp = footer) ? "" : pug_interp) + "\u003C\u002Fdiv\u003E";
}
pug_html = pug_html + "\u003C\u002Fdiv\u003E\u003C\u002Fdiv\u003E";}.call(this,"body" in locals_for_with?locals_for_with.body:typeof body!=="undefined"?body:undefined,"className" in locals_for_with?locals_for_with.className:typeof className!=="undefined"?className:undefined,"footer" in locals_for_with?locals_for_with.footer:typeof footer!=="undefined"?footer:undefined,"title" in locals_for_with?locals_for_with.title:typeof title!=="undefined"?title:undefined));;return pug_html;}