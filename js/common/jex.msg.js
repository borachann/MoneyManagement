(function() {
	/**
	 * Message 정의
	 */
	var _JexMessage = JexMsg.extend({
		init:function() {
		},printInfo	:function(code,msg){
			var m = {};
			m['TYPE'] = "INFO";
			m['CODE'] = code;
			m['MSG' ] = (msg)?msg:jex.getMsg(code);
			this.addMsg(m);
		},printError:function(code,msg){
			var m = {};
			m['TYPE'] = "ERROR";
			m['CODE'] = code;
			m['MSG' ] = (msg)?msg:jex.getMsg(code);
			this.addMsg(m);
		},addMsg:function(m) {
			alert(m['MSG']);
		}
	});
	jex.setMsgObj(new _JexMessage());	
})();