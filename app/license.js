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
	"ライセンスの有効日数が規定外です"
];
$(document).ready(function(){

	$.datepicker.setDefaults($.extend({showOtherMonths:true,selectOtherMonths:true,showAnim:'fadeIn',showOn:'focus'}, CALENDAR));
	$("#limitdate").datepicker();

	$('#issue').on("click", function(ev){
		var ok = Premium.issue($('#usercode').val(), $('#limitdate').val());
		var res = Premium.result();
		if (ok) {
			$('#licensekey').val(res.license);
		} else {
			$('#licensekey').val("#error - " + ERRORS[parseInt(res.code, 10)]);
		}
	});


});

