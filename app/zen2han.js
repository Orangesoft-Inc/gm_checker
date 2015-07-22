// 全角数字など特定文字を半角に

var HanConvert = function() {
	var zenTable = [
	//	"　",   "ー",   "・",   "．",   "＿",   "－",   "０",   "１",   "２",   "３",   "４",   "５",   "６",   "７",   "８",   "９"
		0x3000, 0x30fc, 0x30fb, 0xff0e, 0xff3f, 0xff0d, 0xff10, 0xff11, 0xff12, 0xff13, 0xff14, 0xff15, 0xff16, 0xff17, 0xff18, 0xff19
	];
	var hanTable = [
	//	" ",  "-",  ".",  "．", "_",  "-", "0",  "1",  "2",  "3",  "4",  "5",  "6",  "7",  "8",  "9"
		0x20, 0x2d, 0x2e, 0x2e, 0x5f, 0x2d, 0x30, 0x31, 0x32, 0x33, 0x34, 0x35, 0x36, 0x37, 0x38, 0x39
	];
	function isZen(c) { return zenTable.indexOf(c); };
	return {
		zen2han: function(src) {
			var i, ch, code, next;
			var str = new String;
			var len = src.length;
			for (i = 0; i < len; i++) {
				var c = src.charCodeAt(i);
				var idx = isZen(c);
				if (idx >= 0) {
					code = hanTable[idx];
					str += String.fromCharCode(code);
				} else {
					str += src[i];
				}
			}
			return str;
		}
	};
}();

