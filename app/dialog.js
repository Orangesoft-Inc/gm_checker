////////////////////////////////////////////////////////////
// dialog
//

Array.prototype.removeEmpty = function() { return this.filter(function(A){ return (typeof A != 'undefined' && A != null && (A.length == null || A.length > 0)); }); }
Array.prototype.mapIf = function(cbf, arg) {
	var T, A, k;
	if (this == null) { throw new TypeError(" this is null or not defined"); }
	var O = Object(this);
	var len = O.length >>> 0;
	if ({}.toString.call(cbf) != "[object Function]") { throw new TypeError(cbf + " is not a function"); }
	A = []; T = arg; k = 0;
	while(k < len) {
		var vl, mvl;
		if (k in O) { vl = O[ k ]; mvl = cbf.call(T, vl, k, O); if (mvl != null) { A.push(mvl); } }
		k++;
	}
	return A;
}
String.prototype.toWordArray = function() { return this != "" ? this.replace(/\r/g, "").split(/[,\s\n]+/) : []; }
String.prototype.toLineArray = function() { return this != "" ? this.replace(/\r/g, "").split(/\n+/) : []; }

var KEYS = {
	VK_CANCEL:3,	VK_HELP:6,		VK_BACKSPACE:8,	VK_TAB:9,		VK_CLEAR:12,	VK_RETURN:13,	VK_ENTER:13,
	VK_SHIFT:16,	VK_CONTROL:17,	VK_ALT:18,		VK_PAUSE:19,	VK_CAPSLOCK:20,	VK_ESCAPE:27,	VK_SPACE:32,
	VK_PAGE_UP:33,	VK_PAGE_DOWN:34,VK_END:35,		VK_HOME:36,		VK_LEFT:37,		VK_UP:38,		VK_RIGHT:39,
	VK_DOWN:40,		VK_PRINTSCREEN:44,				VK_INSERT:45,	VK_DELETE:46,	VK_0:48,		VK_1:49,
	VK_2:50,		VK_3:51,		VK_4:52,		VK_5:53,		VK_6:54,		VK_7:55,		VK_8:56,
	VK_9:57,		VK_SEMICOLON:59,VK_EQUALS:61,	VK_A:65,		VK_B:66,		VK_C:67,		VK_D:68,
	VK_E:69,		VK_F:70,		VK_G:71,		VK_H:72,		VK_I:73,		VK_J:74,		VK_K:75,
	VK_L:76,		VK_M:77,		VK_N:78,		VK_O:79,		VK_P:80,		VK_Q:81,		VK_R:82,
	VK_S:83,		VK_T:84,		VK_U:85,		VK_V:86,		VK_W:87,		VK_X:88,		VK_Y:89,
	VK_Z:90,		VK_CONTEXTMENU:93,				VK_NUMPAD0:96,	VK_NUMPAD1:97,	VK_NUMPAD2:98,	VK_NUMPAD3:99,
	VK_NUMPAD4:100,	VK_NUMPAD5:101,	VK_NUMPAD6:102,	VK_NUMPAD7:103,	VK_NUMPAD8:104,	VK_NUMPAD9:105,	VK_MULTIPLY:106,
	VK_ADD:107,		VK_SEPARATOR:108,				VK_SUBTRACT:109,VK_DECIMAL:110,	VK_DIVIDE:111,	VK_F1:112,
	VK_F2:113,		VK_F3:114,		VK_F4:115,		VK_F5:116,		VK_F6:117,		VK_F7:118,		VK_F8:119,
	VK_F9:120,		VK_F10:121,		VK_F11:122,		VK_F12:123,		VK_F13:124,		VK_F14:125,		VK_F15:126,
	VK_F16:127,		VK_F17:128,		VK_F18:129,		VK_F19:130,		VK_F20:131,		VK_F21:132,		VK_F22:133,
	VK_F23:134,		VK_F24:135,		VK_NUMLOCK:144,	VK_SCROLLLOCK:145,				VK_COMMA:188,	VK_PERIOD:190,
	VK_SLASH:191,	VK_BACK_QUOTE:192,				VK_OPEN_BRACKET:219,			VK_BACK_SLASH:220,
	VK_CLOSE_BRACKET:221,			VK_QUOTE:222,	VK_META:224
};

function isEmpty(elm) { return (!elm || elm.length == 0); }

function escapeHtml(value) {
	return !isEmpty(value) ?
			value.replace(/&/g, '&amp;')
				.replace(/"/g, '&quot;')
				.replace(/</g, '&lt;')
				.replace(/>/g, '&gt;')
			: "";
}

function loadhtml(url, param) {
	return $.ajax({
		url: url + (!isEmpty(param) ? ('?' + param) : ''),
		async: false,
		error: function(req, stat, e) { throw "cannot load"; /* エラーの場合の処理をいずれ… */ }
	}).responseText;
}
(function($) {
	$.fn.importHtmlPart = function(htmlfile) {
		var url = chrome.extension.getURL('/' + htmlfile);
		// 多言語対応
		var html = loadhtml(url).replace(/__MSG_[A-Za-z0-9]+(_?[A-Za-z0-9])*__/g, function(s) {
			return chrome.i18n.getMessage(s.slice(6, -2));
		});
		return this.each(function(){ $(this).html(html); });
	};
})(jQuery);

function cssAddRule(selector, rule) {
	if (isEmpty(document.styleSheets)) {
		var s = document.createElement('style');
		s.setAttribute("type", "text/css");
		document.getElementsByTagName('head').item(0).appendChild(s);
	}
	var ss = document.styleSheets[0];
	ss.insertRule(selector + " {" + rule + "}", ss.cssRules.length);
}

function cssFindRule(exp) {
	var ss = document.styleSheets[0];
	if (ss && ss.cssRules) {
		for (var i = ss.cssRules.length - 1; i >= 0 ; i--) {
			if (ss.cssRules[i].selectorText && ss.cssRules[i].selectorText.match(exp)) return true;
		}
	}
	return false;
}

var em2pix = function(){
	var unit = false;
	return {
		reset:function(){ unit = false; },
		calc:function(length) {
			if (!unit) {
				// 1emのピクセルサイズを計算する
				var tmp = $('<div>').css({visibility:"hidden",position:"absolute",width:"1em",height:"1em",padding:0,margin:0,zIndex:0}).appendTo($(document.body));
				unit = tmp.height();
				tmp.remove();
			}
			return Math.floor(unit * parseFloat(length));
		}
	};
}();

function uiDialog(id, data, offsetLeft, offsetTop) {

	this.id = null;
	this.wnd = null;
	this.title = null;
	this.page = null;
	this.width = 0;
	this.height = 0;
	this.minwidth = 300;
	this.top = 0;
	this.left = 0;
	this.autoposition = true;
	this.contents = null;
	this.candrag = true;
	this.zindex = 2000;
	this.oninit = null;
	this.oncancel = null;
	this.onsubmit = null;
	this.onbutton = null;
	this.oncheck = null;
	this.onradio = null;
	this.onselchange = null;
	this.ondblclick = null;
	this.onkeydown = null;						// キー入力処理
	this.onclose = null;						// ダイアログが閉じたとき（wndは有効）
	this.ondestroy = null;						// ダイアログが削除されたとき（wndは無効）
	this.onchildexit = null;					// 重ねた子ダイアログが終了したとき
	this.escape = true;
	this.sysclose = true;
	this.dlgresult = null;
	this.csspanel = null;
	this.param = null;

	if (id && $('#'+id).length > 0) {
		this.id = id;
		this.wnd = $('#'+id);
	}
	if (data) {
		if (typeof data == 'string') {
			this.contents = data;
		} else {
			this.page = data.url;
			if (data.w) {
				this.width = /em$/.test(data.w) ? em2pix.calc(data.w) : data.w;
			}
			if (data.h) {
				this.height = /em$/.test(data.h) ? em2pix.calc(data.h) : data.h;
			}
		}
	}
	if (offsetTop >= 0) { this.top = offsetTop; }
	if (offsetLeft >= 0) { this.left = offsetLeft; }
}
uiDialog.prototype.validate = function() {
	return (this.wnd && (this.page || this.contents));
}
uiDialog.prototype.open = function(autowidth, autoheight) {
	if (!this.validate()) return;
	this.wnd.hide();

	autowidth = autowidth || false;
	autoheight = autoheight || false;
	this.contents ? this.wnd.html(this.contents) : this.wnd.importHtmlPart(this.page);

	var me = this;
	var caption = this.wnd.children('h2');

	this.wnd.css({minWidth:this.minwidth});		// 最小幅を
	if (caption.length > 0) {
		this.title && caption.text(this.title);
		caption.wrapInner('<span></span>');			// タイトルをラップ

		if (this.sysclose) {
			// キャプション右はじのcloseボタン
			$('<span>')
				.attr("class","sysclose imF btnicon close")
				.appendTo(caption)
				.on("click", function(ev){
					ev.returnValue = false; ev.preventDefault();
					me.oncancel && me.oncancel(this);
				});
		}
	}
	this.csspanel && this.wnd.addClass(this.csspanel);

	this.reposition(autowidth, autoheight, this.autoposition);
	this.wnd.css({zIndex:this.zindex}).show();

	if (this.candrag) {
		if (caption.length > 0) {
			caption.css({cursor:'move'});
			try {							// ui.draggable.js が組み込まれていない場合を考慮
				this.wnd.draggable( {
					handle: 'h2',			// キャプションは 'h2' で記述されていること
					zIndex: this.zindex,
					containment: 'window',
					scroll: false
				});
			} catch(e) {
				this.candrag = false;
			}
		} else {
			this.candrag = false;
		}
	}

	if (this.onsubmit) {
		this.wnd.find(':submit').on("click", function(ev){
			ev.preventDefault(); ev.returnValue = false;
			me.onsubmit(this);
		});
	}
	if (this.oncancel || this.onbutton) {
		this.wnd.find(':button').on("click", function(ev){
			if (this.name == 'cancel' && me.oncancel) {
				ev.preventDefault(); ev.returnValue = false;
				me.oncancel(this);
			} else if (me.onbutton) {
				ev.preventDefault(); ev.returnValue = false;
				me.onbutton(this);
			}
		});
	}
	if (this.oncheck) {
		this.wnd.find(':checkbox').on("click", function(ev){
			ev.returnValue = false;
			me.oncheck(this);
		});
	}
	if (this.onradio) {
		this.wnd.find(':radio').on("click", function(ev){
			ev.returnValue = false;
			me.onradio(this);
		});
	}
	if (this.onselchange) {
		this.wnd.find('select').on("change", function(ev){
			ev.returnValue = false;
			me.onselchange(this);
		});
	}
	if (this.ondblclick) {
		this.wnd.find('select').on("dblclick", function(ev){
			ev.returnValue = false;
			me.ondblclick(this);
		});
	}
	this.wnd.children('form').on("submit", function(ev){
		ev.preventDefault(); ev.returnValue = false;
	});
}
uiDialog.prototype.close = function(anim) {
	if (this.validate()) {
		if (!this.noclose) {
			if (this.candrag) this.wnd.draggable('destroy');
			this.wnd.hide();
			$.isFunction(this.onclose) && this.onclose();
			this.wnd.remove();
			this.wnd = null;
		}
	}
	return this;
}
uiDialog.prototype.reposition = function(autowidth, autoheight, autoposition) {
	if (!this.validate()) return;
	var rc = {
		x :this.left + (autoposition ? Math.floor(($(window).width() - this.left - this.width) / 2) : 0),
		y :this.top + (autoposition ? Math.floor(($(window).height() - this.height) / 3) : 0),
		cx:(!autowidth ? this.width : 0),
		cy:(!autoheight ? this.height : 0)
	};
	rc.y = Math.max(0, rc.y);
	this.wnd.css({width:(rc.cx==0?'auto':rc.cx),height:(rc.cy==0?'auto':rc.cy),top:rc.y,left:rc.x});
	return this;
}
uiDialog.prototype.fullwindow = function(padding) {
	if (!this.validate()) return;
	if (!padding) {
		padding = { left:16, top:16, right:16, bottom:16 };
	}
	var rc = {
		x :padding.left,
		y :padding.top,
		cx:$(window).width() - (padding.left + padding.right),
		cy:$(window).height() - (padding.top + padding.bottom)
	};
	this.wnd.css({width:(rc.cx), height:(rc.cy), top:rc.y, left:rc.x});
	return this;
}
uiDialog.prototype.centerWindow = function(parent) {
	if (this.validate()) {
		var rc = (parent != null) ? getElementPosition(parent) : { left:0, top:0, right:$(window).width(), bottom:$(window).height() };
		var pos = {
			x:Math.floor((rc.right - rc.left - this.wnd.outerWidth(true)) / 2),
			y:Math.floor((rc.bottom - rc.top - this.wnd.outerHeight(true)) / 2)
		};
		this.wnd.moveTo(pos.x, pos.y);
	}
	return this;
}
uiDialog.prototype.upsideWindow = function(parent) {
	if (this.validate()) {
		var rc = (parent != null) ? getElementPosition(parent) : { left:0, top:0, right:$(window).width(), bottom:$(window).height() };
		var pos = {
			x:Math.floor((rc.right - rc.left - this.wnd.outerWidth(true)) / 2),
			y:Math.floor((rc.bottom - rc.top - this.wnd.outerHeight(true)) / 3)
		};
		pos.x = Math.max(0, pos.x);
		pos.y = Math.max(0, pos.y);
		this.wnd.moveTo(pos.x, pos.y);
	}
	return this;
}
uiDialog.prototype.moveWindow = function(x, y) {
	if (this.validate()) {
		x = Math.max(Math.min($(window).width(), x), 0);
		y = Math.max(Math.min($(window).height(), y), 0);
		this.wnd.moveTo(x, y);
	}
	return this;
}
uiDialog.prototype.setcontents = function(value) {
	this.contents = value;
	return this;
}
uiDialog.prototype.canEscape = function() {
	return this.escape;
}
uiDialog.prototype.setCancel = function(func) {
	this.oncancel = func;
	return this;
}
uiDialog.prototype.cancel = function() {
	if ($.isFunction(this.oncancel)) this.oncancel();
}
uiDialog.prototype.zOrder = function(order) {
	this.zindex = order;
	return this;
}
uiDialog.prototype.initCompleted = function() {
	$.isFunction(this.oninit) && this.oninit(this);
}
uiDialog.prototype.exitChild = function(result) {
	$.isFunction(this.onchildexit) && this.onchildexit(result);
}
uiDialog.prototype.setResult = function(result) {
	this.dlgresult = result;
}
uiDialog.prototype.caption = function() {
	if (!this.validate()) return;
	var cap = this.wnd.children('h2');
	if (arguments.length == 0) { return cap.text(); }
	cap.text(resString(arguments[0]));
	return this;
}
uiDialog.prototype.keyXlate = function(ev) {
	// キー入力を処理したら true で返る
	if (this.onkeydown && this.onkeydown(ev)) {
		ev.preventDefault();
		return true;
	}
	switch (ev.keyCode) {
	case KEYS.VK_ENTER:
		if (ev.ctrlKey) {
			ev.preventDefault();
			return true;
		} else if (!ev.shiftKey && this.onsubmit) {
			ev.preventDefault();
			var submit = this.wnd.find(':submit');
			!submit.prop('disabled') && submit.trigger("click");
			return true;
		}
		break;
	case KEYS.VK_ESCAPE:	// esc
		if (this.canEscape()) {
			this.cancel();
			return true;
		}
		break;
	}
	return false;
}

////////////////////////////////////////////////////////////
// ダイアログボックス管理

var Dialog = function(){
	var stack = [];
	return {
		size:function(){ return stack.length; },
		push:function(dlg){
			// ダイアログ下のウィンドウを disable にするため
			var css = {width:$(window).width(),height:$(window).height(),zIndex:dlg.zindex-2};
			var wrap = $('#gmc_overlay').css(css);
			if (wrap.length == 0) { wrap = $('<div>').attr({id:'gmc_overlay'}).css(css).insertBefore(dlg.wnd); }
			stack.push(dlg);
		},
		pop:function(){ return stack.pop(); },
		hasDialog:function(){ return (stack.length > 0); },
		close:function() {
			var dlg = stack.pop();
			if (dlg) {
				dlg.close();
				$.isFunction(dlg.ondestroy) && dlg.ondestroy();
				if (stack.length > 0) {
					var last = stack[stack.length - 1];
					$('#gmc_overlay').css({zIndex:last.zindex-2});			// オーバーレイを再配置
					last.exitChild(dlg.dlgresult);						// フォーカスバック
				} else {
					$('#gmc_overlay').remove();
				}
			}
		},
		closeAll:function(){ while (stack.length > 0) { this.close(); } },
		current: function() { return (stack.length > 0) ? stack[stack.length - 1] : null; },
		layout:function(){ $('#overlay').css({top:0,left:0,width:$(window).width(),height:$(window).height()}); },
		processKey:function(e) { return (stack.length > 0) ? stack[stack.length - 1].keyXlate(e) : false; }
	};
}();

function dialogOpen() {
	if (arguments.length == 0) { return null; }

	var option = {
		cls: 'dialog',
		id: 'dialog-'+Dialog.size(),
		resource: '',
		oncancel: function(){ Dialog.close(); },
		onsubmit: function(){ Dialog.close(); },
		autowidth: false,
		autoheight: true,
		autoposition: true,
		zindex: 1200
	};
	$.extend(option, arguments[0]);

	var numdlg = Dialog.size();
	var wnd = $('<div>').attr({id:option.id}).addClass(option.cls).appendTo($(document.body)).hide();
	var dlg = new uiDialog(option.id, option.resource, 16 * numdlg, 20 * numdlg);
	if (!dlg.validate()) {
		wnd.remove();
		return null;
	}

	[	"title", "param", "escape", "autoposition", "sysclose",
		"candrag", "width", "minwidth", "left", "top",
		"csspanel", "oncancel", "oninit", "onsubmit", "onbutton",
		"oncheck", "onradio", "onselchange", "ondblclick", "onkeydown",
		"onclose", "ondestroy", "onchildexit"
	].forEach(function(n){ (option[n] != null) && (dlg[n] = option[n]); });

	dlg.zindex = option.zindex + (numdlg * 10);
	try {
		var aw = option.autowidth || false;
		var ah = option.autoheight || false;
		dlg.open(aw, ah);
	} catch (e) {
		// サーバーアクセスエラー時の処理を追加
		wnd.remove();
		return null;
	}
	Dialog.push(dlg);
	dlg.initCompleted();
	return dlg;
}

