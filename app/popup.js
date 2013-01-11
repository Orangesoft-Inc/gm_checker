$(document).ready(function() {

    var CONFIG = {
        TO_CC: "jp.co.orangesoft.GM_Checker.config.to_cc",
        CONFIRM_SENT: "jp.co.orangesoft.GM_Checker.config.confirm_sent",
        KEYWORD: "jp.co.orangesoft.GM_Checker.config.keywords",
        FORCE_BCC: "jp.co.orangesoft.GM_Checker.config.force_bcc",
    };

    var tocc = localStorage.getItem(CONFIG.TO_CC);
//  console.log(tocc);
    if(tocc != null){
        $("#to_cc").val(tocc);
    }else{
        $("#to_cc").val('10');
    }

    $('#to_cc').on('change', function(){
        $('#msg').text($(this).val());
        localStorage.setItem(CONFIG.TO_CC, $(this).val());
    });

    var val = localStorage.getItem(CONFIG.CONFIRM_SENT);
//  console.log(tocc);
    $("#confirm_sent").attr('checked', true);
    if(val != null){
        if(val != 'true'){
            $("#confirm_sent").attr('checked', false);
        }
    }

    var val = localStorage.getItem(CONFIG.KEYWORD);
    if(val != null){
        $('#keywords').val(val);
    }

    $('#keywords').on('keyup', function() {
        localStorage.setItem(CONFIG.KEYWORD, $('#keywords').val());
        $('#msg').text($('#keywords').val());
    });

    var val = localStorage.getItem(CONFIG.FORCE_BCC);
    if(val != null){
        $('#force_bcc').val(val);
    }

    $('#force_bcc').on('keyup', function() {
        localStorage.setItem(CONFIG.FORCE_BCC, $('#force_bcc').val());
        $('#msg').text($('#force_bcc').val());
    });

    $('#confirm_sent').on('click', function(){
        $('#msg').text('-');
        $('#msg').text($(this).attr('checked'));
        var confirm_sent = ($(this).attr('checked') == 'checked');
        localStorage.setItem(CONFIG.CONFIRM_SENT, confirm_sent);
    });


});
