function includeJs(defaultUrl, iosUrl) {

	if(iosUrl != null && iosUrl.length > 0){
		var os = "iPhone";
		var os2= "iPad";
		var agent		= navigator.userAgent;
		var checker = new RegExp(os);
		var checker2 = new RegExp(os2);
		if (checker.test(agent) || checker2.test(agent)){
			document.write("<script type='text/javascript' src='" + iosUrl + "'></script>");
			return;
		}
	}
	
	var jScript = "<script type='text/javascript' src='" + defaultUrl + "'></script>";
	document.write(jScript); 

}

includeJs("js/common/json2.js");
includeJs("js/common/jfm-1.0.0.js");
//includeJs("js/common/jquery-1.7.2.min.js");
//includeJs("js/common/jquery-1.10.2.min.js");
//includeJs("/js/lib/jquery-2.0.0.min.js");
//includeJs("/js/lib/jquery-1.10.2.min.js");
//includeJs("/js/lib/jquery-1.8.3.min.js");

includeJs("js/common/jquery-ui-1.10.2.nonwidget.min.js");
includeJs("js/common/toastr.min.js");
includeJs("js/common/jex.core.js");
includeJs("js/common/jex.msg.js");
includeJs("js/common/jex.executer.js");
includeJs("js/common/jex.svc.js");
includeJs("js/common/jex.input.js");
includeJs("js/common/jex.effect.js");
includeJs("js/common/jex.view.js");
includeJs("js/common/jex.list.js");
includeJs("js/common/jquery.bpopup.min.js");
includeJs("js/common/bootstrap.min.js");
includeJs("js/common/xregexp-all.js");

includeJs("js/common/jex.tbl5.js");
includeJs("js/common/toastr.js");


