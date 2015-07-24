var CALENDAR = {
	closeText: "終了",
	prevText: "前へ",
	nextText: "次へ",
	currentText: "今日",
	monthNames: ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"],
	monthNamesShort: ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"],
	dayNames:["日曜日","月曜日","火曜日","水曜日","木曜日","金曜日","土曜日"],
	dayNamesShort:["日","月","火","水","木","金","土"],
	dayNamesMin:["日","月","火","水","木","金","土"],
	dateFormat: 'yymmdd',
	showOtherMonths: true,
	firstDay:0,
	isRTL:false
};

var ERRORS = [
	"",
	"ユーザーコードが6桁の文字列ではありません",
	"ライセンス終了日が8桁の文字列ではありません",
	"ライセンス終了日が間違っています",
	"ライセンスの有効日数が規定外です",
	"ハッシュ値が間違っています"
];
$(document).ready(function(){

	$.datepicker.setDefaults($.extend({showOtherMonths:true,selectOtherMonths:true,showAnim:'fadeIn',showOn:'focus'}, CALENDAR));
	$("#limitdate").datepicker();

	// 初期表示は1年後の今日
	var ct = new Date();
	$("#limitdate").val(String(ct.getFullYear() + 1) + ("0" + (ct.getMonth() + 1)).slice(-2) + ("0" + ct.getDate()).slice(-2));

	$('#issue').on("click", function(ev){
		var ok = Premium.issue($('#usercode').val(), $('#limitdate').val());
		var res = Premium.result();
		if (ok) {
			$('#licensekey').val(res.license).focus().select();
		} else {
			$('#licensekey').val("#error - " + ERRORS[parseInt(res.code, 10)]);
			(res.code == 1) ? $('#usercode').focus() : $('#limitdate').focus();
		}
	});

	$('#validate').on("click", function(ev){
		var ok = Premium.validate($('#licensekey').val());
		var res = Premium.result();
		if (ok) {
			var s = "検証OK: ライセンス終了日は%Y年%M月%D日"
					.replace("%Y", res.limit[0])
					.replace("%M", res.limit[1])
					.replace("%D", res.limit[2]);
			$('#leftdate').text(s).removeClass('invalid').addClass('valid');
		} else {
			$('#leftdate').text("検証NG: " + ERRORS[res.code]).removeClass('valid').addClass('invalid');
		}
	});


});

