// ==UserScript==
// @name        Confirm Domain
// @namespace   http://www.skynet-prj.com
// @description This greasemonkey script check domain.
// @include     http*://mail.google.com/mail/*
// @version     v20120629
// ==/UserScript==

function main() {

  var mydomain = null;

  /****** 以下修正しちゃだめです **************************************/

  var gaRetries = 0;
  var ccField;
  var toField;
  var bccField;
  var ccOld = "";
  var toOld = "";
  var bccOld = "";
  //var SENDBTN1 = "T-I J-J5-Ji Bq nS T-I-KE L3";
  var SENDBTN1 = "T-I J-J5-Ji aoO T-I-atl L3";
  var SENDBTN2 = "T-I J-J5-Ji Bq nS T-I-ax7 L3";
  var stopBubbleFlag = false;
  var root;
  var errorFlag;

  function checkDomain(target) {
    var adrsCount;
    var domainList = new Array(mydomain);

    var from = $('input[name="from"]').val();
    if(from != null){
      mydomain = "";
    }

    // to,cc,bccのアドレスを取得
    console.log(">>");
    $('.vN.Y7BVp').each(function(){
      console.log(">>"+$(this).attr('email'));
    });
    console.log(">>>>");
    $('input[name="to"],input[name="cc"],input[name="bcc"]').each(function(){
      console.log($(this).val());
    });
    return;

    var adrsField = root.getElementsByName(":f4").item(0).value.replace(/[^,]+<([^>]+)>/g, "$1");
    adrsField = adrsField + "," + root.getElementsByName("cc").item(0).value.replace(/[^,]+<([^>]+)>/g, "$1");
    adrsField = adrsField + "," + root.getElementsByName("bcc").item(0).value.replace(/[^,]+<([^>]+)>/g, "$1");
    adrsField = adrsField.replace(/ /g,"");
    adrsField = adrsField.replace(/\n/g,",");

    var adrsStr = "   ";
    var domainStr = "   ";

    errorFlag = 0;
    if (adrsField !== ",,") {
      var adrsArray = adrsField.split(",");
      for (var i = 0,adrsCount = 0;i < adrsArray.length;i++) {
        var tmpAdrs = adrsArray[i];
        if (tmpAdrs.length > 100) {
          errorFlag = 1;
          break;
        }
        var domainArray = tmpAdrs.split("@");
        var cmpDomain;
        if (domainArray.length === 1) {
          cmpDomain = mydomain;
        } else if (domainArray.length === 2) {
          cmpDomain = domainArray[1].toLowerCase();
        } else {
          errorFlag = 2;
          break;
        }
        if ((adrsArray[i] !== "") && (cmpDomain !== mydomain)) {
          adrsStr = adrsStr + "\n   " + adrsArray[i];
          for (j = 0;j < domainList.length;j++) {
            if (domainList[j] === cmpDomain) {
              break;
            }
          }
          if (j === domainList.length) {
            domainList.push(cmpDomain);
            domainStr = domainStr + "\n   " + cmpDomain;
          }
          adrsCount++;
        }
      }
      if (errorFlag === 0) {
        if (adrsCount > 0) {
          replaceBtnName3(target);
          if (confirm("「" + mydomain +"」以外に送信しようとしていますが、よろしいですか？\n\nアドレス:\n" + adrsStr + "\n\nドメイン:\n" + domainStr + "\n\nよろしければOKボタンを押した後、「本当に送信」ボタンを押してください。")) {
            stopBubbleFlag = true;
            replaceBtnName1(target);
          } else {
            stopBubbleFlag = false;
            replaceBtnName2(target);
          }
        } else {
          replaceBtnName3(target);
          if (confirm("「" + mydomain + "」以外へは送信されません。\n\nよろしければ、OKボタンを押した後、「本当に送信」ボタンを押してください。")) {
            stopBubbleFlag = true;
            replaceBtnName1(target);
          } else {
            stopBubbleFlag = false;
            replaceBtnName2(target);
          }
        }
      } else if (errorFlag === 1) {
        alert("メールアドレスが長すぎます。");
        stopBubbleFlag = false;
        replaceBtnName2(target);
      } else if (errorFlag === 2) {
        alert("メールアドレス内に＠が複数存在します。");
        stopBubbleFlag = false;
        replaceBtnName2(target);
      } else {
        stopBubbleFlag = false;
        replaceBtnName2(target);
      }
    } else {
      alert("送信先メールアドレス（To,Cc,Bcc)が記入されていません。");
      stopBubbleFlag = false;
      replaceBtnName2(target);
    }
  }

  function checkClass(event) {
    console.log('checkClass1');
    var tgt;
    var tgClass = event.target.getAttribute ("class");
    if (tgClass == null) {
      tgClass = event.target.parentNode.getAttribute("class");
      tgt = event.target.parentNode;
    } else {
      tgt = event.target;
    }
    if ((tgClass.match (SENDBTN1)) ||
        (tgClass.match (SENDBTN2))) {
      if ((!stopBubbleFlag) || (tgt.innerHTML !== "<b>本当に送信</b>")) {
        event.stopPropagation();
        checkDomain(tgt);
      }
    }
  }

  function checkAddress(event) {
    if (typeof (event.target.getAttribute) == 'function') {
      var tgName = event.target.getAttribute ("name");
      if (tgName === 'to') {
        toField = root.getElementsByName("to").item(0).value.replace(/[^,]+<([^>]+)>/g, "$1");
        toField = toField.replace(/ /g,"");
        toField = toField.replace(/\n/g,",");
        toField = toField.toLowerCase();
        if (toField !== toOld) {
          stopBubbleFlag = false;
          toOld = toField;
        }
      } else if (tgName === 'cc') {
        ccField = root.getElementsByName("cc").item(0).value.replace(/[^,]+<([^>]+)>/g, "$1");
        ccField = ccField.replace(/ /g,"");
        ccField = ccField.replace(/\n/g,",");
        ccField = ccField.toLowerCase();
        if (ccField !== ccOld) {
          stopBubbleFlag = false;
          ccOld = ccField;
        }
      } else if (tgName === 'bcc') {
        bccField = root.getElementsByName("bcc").item(0).value.replace(/[^,]+<([^>]+)>/g, "$1");
        bccField = bccField.replace(/ /g,"");
        bccField = bccField.replace(/\n/g,",");
        bccField = bccField.toLowerCase();
        if (bccField !== bccOld) {
          stopBubbleFlag = false;
          bccOld = bccField;
        }
      }
    }
  }

  function replaceBtnName1(target) {
    target.innerHTML = "<b>本当に送信</b>";
  }

  function replaceBtnName2(target) {
    target.innerHTML = "<b>送信</b>";
  }

  function replaceBtnName3(target) {
    target.innerHTML = "<b>確認中</b>";
  }

  function confirmDomainInit () {
    root = document;
    try {
      document.addEventListener ("change",    function(event) { checkAddress(event);    } , true);
      document.addEventListener ("click",     function(event) { checkClass(event);      } , true);
      document.addEventListener ("mousedown", function(event) { checkClass(event);      } , true);
      document.addEventListener ("mouseup",   function(event) { checkClass(event);      } , true);
    }
    catch (ex) {
      GM_log ("ConfirmDomain: Exception '"+ ex.message);
      if (gaRetries < 3) {
        gaRetries ++;
        window.setTimeout (confirmDomainInit, 250);
      }
    }
  }

  console.log("main start.");
  window.setTimeout (confirmDomainInit, 750);
}

function addJQuery(callback) {
  var script = document.createElement("script");
  script.setAttribute("src", "https://ajax.googleapis.com/ajax/libs/jquery/1.8.3/jquery.min.js");
  script.addEventListener('load', function() {
    var script = document.createElement("script");
    script.textContent = "(" + callback.toString() + ")();";
    document.body.appendChild(script);
  }, false);
  document.body.appendChild(script);
}

addJQuery(main);


