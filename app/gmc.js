var gmailChecker = (function(){

	// 設定
	var options = null ;

	var getOptions = function() {
		chrome.extension.sendMessage({cmd: "get_options"}, function(response) {
			options = response.options;
//		  console.debug('init='+response.options.tocc+","+response.options.confirm_sent);
//		  console.debug('init='+response.options.keywords.length);
		});
	}

	// セレクタ内の':'をエスケープする（jquery）
	var escapeSelector = function(id) {
		return id.replace(':', '\\:');
	}

	// 新しい送信画面からフォームの値を取得
	var getFormValues = function(target) {

	   console.debug('getFormValues');

		// submitされたボタンのformタグを取得する。
		var t = $(target).parent().get(0);
		var formElement = null;
		while(formElement == null && t != null) {
			$(t).find('form').each(function() {
				formElement = $(this);
			});
			t = $(t).parent().get(0);
		}
		if(formElement == null) {
			alert('予期しないエラーが発生しました。(10)');
			return false;
		}
		var formid = "#" + escapeSelector(formElement.attr('id'));
//		console.debug('form:'+formid);

		// 各要素のセレクタ
		var FROM = formid + ' input[name="from"]';
		var TO = formid + ' input[name="to"]';
		var CC = formid + ' input[name="cc"]';
		var BCC = formid + ' input[name="bcc"]';
		var SUBJECT = formid + ' input[name="subjectbox"]';
		var BODY = formid + ' input[name="body"]';

		var from = $(FROM).val();
		var mydomain = "";
		if(from != null) {
			mydomain = ("@" + getDomain(from)).toLowerCase();
		}
		var domainList = new Array(mydomain);
//		console.debug('mydomain:'+mydomain);

		// to,cc,bccのアドレスを取得
		var result = {
			mydomain: mydomain,
			from: from
		};

		var to = [];
		var to_outer = []; // 外部ドメインへの送信数
		var cc = [];
		var cc_outer = [];
		var bcc = [];
		var bcc_outer = [];
		var all = [];
		var all_outer = [];
		$(TO).each(function() {
			to.push($(this).val());
			all.push($(this).val());
			if($(this).val().toLowerCase().indexOf(mydomain) != -1) {
				to_outer.push($(this).val());
				all_outer.push($(this).val());
			}
		});
		result.to = to;
		result.to_outer = to_outer;

		$(CC).each(function() {
			cc.push($(this).val());
			all.push($(this).val());
			if($(this).val().toLowerCase().indexOf(mydomain) != -1) {
				cc_outer.push($(this).val());
				all_outer.push($(this).val());
			}
		});
		result.cc = cc;
		result.cc_outer = cc_outer;

		$(BCC).each(function() {
			bcc.push($(this).val());
			all.push($(this).val());
			if($(this).val().toLowerCase().indexOf(mydomain) != -1) {
				bcc_outer.push($(this).val());
				all_outer.push($(this).val());
			}
		});
		result.bcc = bcc;
		result.bcc_outer = bcc_outer;
		result.all = all;
		result.all_outer = all_outer;

		var alerts = [];

		var subject = $(SUBJECT).val();
		result.subject = subject;

		var body = getBody(target);
		result.body = body;

		result.from_selector = FROM;

		return result;
	}


	// 古い送信画面からフォームの値を取得
	var getOldFormValues = function(param) {

	   console.debug('getOldFormValues');

		target = param.target;

		// 各要素のセレクタ
		var FROM = 'input[name="from"]';
		var TO = 'textarea[name="to"]';
		var CC = 'textarea[name="cc"]';
		var BCC = 'textarea[name="bcc"]';
		var SUBJECT = 'input[name="subject"]';

		var from = $(FROM).val();
		var mydomain = "";
		if(from != null) {
			mydomain = ("@" + getDomain(from)).toLowerCase();
		}
		var domainList = new Array(mydomain);
		// console.debug('mydomain:'+mydomain);

		// to,cc,bccのアドレスを取得
		var result = {
			mydomain: mydomain,
			from: from
		};

		var to = [];
		var to_outer = []; // 外部ドメインへの送信数
		var cc = [];
		var cc_outer = [];
		var bcc = [];
		var bcc_outer = [];
		var all = [];
		var all_outer = [];

		if($(TO).val() != null){
			var list = $(TO).val().split(",");
			list.forEach(function(value) {
				if(value.length == 0) return;
				to.push(value);
				all.push(value);
				if(value.toLowerCase().indexOf(mydomain) != -1) {
					to_outer.push(value);
					all_outer.push(value);
				}
			});
		}
		result.to = to;
		result.to_outer = to_outer;

		if($(CC).val() != null){
			var list = $(CC).val().split(",");
			list.forEach(function(value) {
				if(value.length == 0) return;
				cc.push(value);
				all.push(value);
				if(value.toLowerCase().indexOf(mydomain) != -1) {
					cc_outer.push(value);
					all_outer.push(value);
				}
			});
		}
		result.cc = cc;
		result.cc_outer = cc_outer;

		if($(BCC).val() != null){
			var list = $(BCC).val().split(",");
			list.forEach(function(value) {
				if(value.length == 0) return;
				bcc.push(value);
				all.push(value);
				if(value.toLowerCase().indexOf(mydomain) != -1) {
					bcc_outer.push(value);
					all_outer.push(value);
				}
			});
		}
		result.bcc = bcc;
		result.bcc_outer = bcc_outer;
		result.all = all;
		result.all_outer = all_outer;
		result.subject = $(SUBJECT).val();
		result.body = getBodyOld(target);
		result.from_selector = FROM;

		return result;
	}

	/**
	 * メール内容のチェックと確認ダイアログの表示
	 * true:問題なし（送信）
	 * false: 問題あり（送信キャンセル）
	 */
	var checkMessage = function(param) {

		var values = null;
		if(param.oldStyle){
//			return confirm("申しわけありません、古い送信画面にはまだ対応できていません。\n新しい送信画面をご利用ください。\nこのメールを送信しますか？");
			values = getOldFormValues(param.target);
		}else{
			values = getFormValues(param.target);
		}
//		console.log(values);

		var from = values.from;
		var mydomain = values.mydomain;
		var domainList = new Array(mydomain);
		var to = values.to;
		var to_outer = values.to_outer; // 外部ドメインへの送信数
		var cc = values.cc;
		var cc_outer = values.cc_outer;
		var bcc = values.bcc;
		var bcc_outer = values.bcc_outer;
		var all = values.all;
		var all_outer = values.all_outer;
		var subject = values.subject;
		var body = values.body;
		var FROM = values.from_selector;

		var alerts = [];

		// 送り先メールアドレスチェック
		if(all.length == 0) {
			alerts.push("送信先メールアドレス（To,Cc,Bcc)が記入されていません。");
		}

		// to+cc件数チェック
		if(to.length + cc.length > options.tocc) {
			alerts.push("宛先とccのメールアドレスの総数が制限[" + options.tocc + "]件を超えています。");
		}

		// to+cc件数チェック(外部)
		if(to_outer.length + cc_outer.length > options.tocc_outer) {
			alerts.push("外部ドメインへ送る宛先とccのメールアドレスの総数が制限[" + options.tocc_outer + "]件を超えています。");
		}

		// 題名チェック
		if(subject == null || subject.length == 0) {
			alerts.push("題名が未記入です。");
		}

		// キーワードチェック  
		if(options.keywords != null){
			// console.debug(subject);
			options.keywords.forEach(function(value, index, array){
				if(!checkerr || value == null || value.length == 0) return;
			});
		}

		// 本文チェック
		if(body == null || body.length == 0) {
			alerts.push("本文が未記入です。");
		}

		// キーワードチェック  
		var checkerr = true;
		if(options.keywords != null){
			// console.debug("body:"+body);
			options.keywords.forEach(function(value, index, array){
				if(!checkerr || value == null || value.length == 0) return;
				if(body != null && body.indexOf(value) != -1){
					alerts.push("警告キーワード["+value+"]が本文に含まれています。");
				}
				if(subject != null && subject.indexOf(value) != -1){
					alerts.push("警告キーワード["+value+"]が題名に含まれています。");
				}
			});
		}
		if(!checkerr){
			return false;
		}


		var result = false;
		if(alerts != null && alerts.length > 0){
			var msg = '';
			alerts.forEach(function(value, index){
				if(index == 0){
					msg = "* "+value+"\n";
				}else{
					msg = msg+"* "+value+"\n";
				}
			});
			result = confirm(msg+"\n本当に送信していいですか？");
		}else{
			// 最終確認
			if(options.confirm_sent){
				result = confirm("メールを送信してよろしいですか？");
			}else{
				result = true;
			}
		}

		if(result){
			// bccを追加
			if(options.force_bcc != undefined && options.force_bcc != null){
				options.force_bcc.forEach(function(value, index){
					if(value.length == 0) return;
					var add_bcc = $('<input type="hidden" name="bcc" value="'+value+'">');
//				  console.log("FROM:"+FROM);
					$(FROM).after(add_bcc);
				});
			}
		}
		return result;
/*テストコード
		var btn = $('<button>メールを送る</button>');
		btn.on('click', {target: target}, function(ev){
			alert('aaa');
			$(ev.data.target).click();
		});

		$(target).after(btn);
		return false;*/

	}

	var getBody = function(target) {

		var body = null;

		// 本文エレメントを探す
		var t = $(target).parent().get(0);
		var bodyElement = null;
		var bodyclass = ".Am.Al.editable.LW-avf";

		while(bodyElement == null && t != null) {
			$(t).find(bodyclass).each(function() {
				bodyElement = $(this);
				body = $(this).text();
			});
			t = $(t).parent().get(0);
		}

		return body;
	}

	var getBodyOld = function(target) {
//		console.log('getBodyOld**');
		var ele = $('iframe.editable').contents().find('body');

		var ele2 = $('.Ak,aXjCH');
		console.log('body'+ele2.val());

		return ele.text()+ele2.val();
	}

	// 送信ボタンがクリックされたかをチェック
	function onclick(event) {
		var target = event.target;
		var cls = target.getAttribute("class");
		var oldStyle = false;
		if(cls == null){
			// nullのときは古い画面
			target = $(target).parent().get(0);
			cls = target.getAttribute("class");
			oldStyle = true;
		}else{
			// 古い画面かの判定
			oldStyle = !newStyle();
		}

		console.log('onclick='+cls);

//	  var btns = ["T-I J-J5-Ji Bq nS T-I-KE L3", "T-I J-J5-Ji aoO T-I-atl L3", "T-I J-J5-Ji Bq nS T-I-ax7 L3"];
//	  var btns = ["T-I J-J5-Ji Bq nS L3", "T-I J-J5-Ji aoO T-I-atl L3"];
		var btnclass = ["T-I", "J-J5-Ji"];

		if(cls.indexOf("T-I") == -1 || cls.indexOf("J-J5-Ji") == -1){
			return null;
		}

		if($(target).text() != '送信'){
			return null;
		}
		return {
				target: target,
				oldStyle: oldStyle,
				event: event
			};

/*		var result = null;
		btns.forEach(function(value, index, array) {
			if(cls.match(value)) {
				result = {
					target: target,
					oldStyle: oldStyle,
					event: event
				}
			}
		});


		return result;*/
	}

	var newStyle = function(){
		var ele = $('iframe.editable').contents().find('body');
		// console.log('new=['+(ele.text())+']');
		// console.log('new=['+(ele.css('display'))+']');
		return ele.css('display') == undefined;
	}

	var timerid = null;

	function init() {

		console.log("GM Checker init");

		try {

			document.addEventListener("click", function(event) {
				// console.log('click');

				if(!newStyle()) return true;  // 新しいスタイルの時はclickで処理

				var result = onclick(event);
				if(result != null) {
					// 送信ボタンがクリックされた
					if(!checkMessage(result)) {
						event.stopPropagation();
						return false;
					}
				}
				return true;
			}, true); // useCapture=true として、イベントハンドラを他のハンドラより先に実行させる。なのでjqueryの'on'などは使えない。

			document.addEventListener("mousedown", function(event) {
				// console.log('mousedown');

				if(newStyle()) return true;  // 古いスタイルの時はmousedownで処理

				var result = onclick(event);
				if(result != null) {
					// 送信ボタンがクリックされた
					if(!checkMessage(result)) {
						event.stopPropagation();
						return false;
					}
				}
				return true;
			}, true); // useCapture=true として、イベントハンドラを他のハンドラより先に実行させる。なのでjqueryの'on'などは使えない。

			// 設定を１秒おきに読み直す（ポーリング）
			timerid = setInterval(getOptions, 1000);

		} catch(ex) {
			alert("初期設定に失敗。" + ex.message);
		}
	}

	// 初期化
	window.setTimeout(init, 750);

	/**
	 * メールアドレスからドメインを抜き出す
	 * メールアドレスの正規表現は http://blog.livedoor.jp/dankogai/archives/51189905.html から。
	 */
	function getDomain(email) {
		var result = email.match(/(^(?:(?:(?:(?:[a-zA-Z0-9_!#\$\%&'*+/=?\^`{}~|\-]+)(?:\.(?:[a-zA-Z0-9_!#\$\%&'*+/=?\^`{}~|\-]+))*)|(?:"(?:\\[^\r\n]|[^\\"])*"))))\@((?:(?:(?:(?:[a-zA-Z0-9_!#\$\%&'*+/=?\^`{}~|\-]+)(?:\.(?:[a-zA-Z0-9_!#\$\%&'*+/=?\^`{}~|\-]+))*)|(?:\[(?:\\\S|[!-Z^-~])*\])))$)/);
		if(result != null) {
			return result[2];
		}
		return null;
	}
})();
