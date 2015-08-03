(function() {
var jexListPlugin = JexPlugin.extend({
	init : function() {
		this.attributeTempalte = "data-jx-list-template";
		this.params = {};
	},
	load : function(attr, $jq) {
		this.dat 			= []; 
		this.obj 			= $jq;
				
		this.layout			= {};
		this.keyList		= {};
		this.tag			= "li";
		this.mode			= "DEFAULT";
		if (this.obj.get(0).tagName.toUpperCase() == "DL"		) this.tag = "dd";
		if (this.obj.get(0).tagName.toUpperCase() == "SELECT"	) this.tag = "option";
		
		this.setLayOut();
		this.printIdx		= 0;
		this.formatter		= jex.getSetAllFormatter();
		this.onclickFn		= {};
		this.pageCnt		= 100;
	},
	parseParams : function(inputParams){
		if(!inputParams || inputParams.length == 0)		return;
		
		var keyValueListOfInputParams = inputParams.split(";");
		
		for(var i = 0, length = keyValueListOfInputParams.length; i < length; i++){
			var keyValueString = keyValueListOfInputParams[i];
			
			if(!keyValueString || keyValueString.length == 0)		continue;
			
			var keyValue = keyValueString.split(":");
			if(!keyValue || keyValue.length != 2)		continue;
						
			var key = $.trim(keyValue[0]);
			var value = $.trim(keyValue[1]);
			
			if(!key || key.length == 0 || !value || value.length == 0)		continue;
			
			this.params[key] = value;
		}
	},
	getDataFromJexService : function(){
//		var result = [];
		var self = this;
		var jexAjax = jex.createAjaxUtil(this.jexService);
//		jexAjax.setAsync(false);
		jexAjax.set(this.params);
		jexAjax.execute(function(dat){
			self.append(dat.REC);
		});
		
//		this.append(result);
	},	
	setPageCnt : function(cnt) {
		this.pageCnt = cnt;
	}, addFormatter : function(key,fn) {
		this.formatter[key] = fn;
	}, get : function(option) {
		return this.obj.find(option);
	}, getData : function(option) {
		var list = this.get(option);
		var rslt = [];
		var r = this;
		$.each(list, function(i,v) { rslt.push(r.dat[$(this).parent().data("data")]); });
		return rslt;
	}, setMode	 : function(m) {
		this.mode		= m;
	}, onClick	 : function() {
		if (arguments.length == 1) {
			this.onclickFn['DEFAULT'] = arguments[0];
		} else if (arguments.length == 2) {
			this.onclickFn[arguments[0]] = arguments[1];
		}
	}, addLayOut : function(key, html) {
		this.layout[key] = html;
		var arr	 = html.split("%");
		var list = [];
		for (var i=0; i<arr.length;i++) {
			if (i%2!=0) list.push(arr[i]);
		}
		this.keyList[key] = list;
	}, setLayOut : function() {
		var lilist = this.obj.find(this.tag);
		lilist.hide();
		if (lilist.length == 0) return;
		this.addLayOut("DEFAULT", $('<p>').append($(lilist[0]).eq(0).clone()).html());
		
		for (var i=0; i<lilist.length; i++) {
			row = $(lilist[i]);
			var id = row.attr(this.attributeTempalte);
			if (jex.isNull(id)) continue;
			this.addLayOut(id, $('<p>').append(row.eq(0).clone()).html());
			if (id != "NORM") row.remove();
		}
	}, setAll : function(data) {
		if (typeof(data) == "string") {
			this.obj.val(data);
			return;
		}
		this.dat = data;
		this.remove();
		this.drawList();
	}, append : function(data) {
		if (!jex.isNull(data)) this.dat.concat(data);
		this.drawList(data);
	}, remove: function() {
		this.obj.find(this.tag+"[id!=NORM]").remove();
	}, drawList: function(d) {
		var dt = (d)?d:this.dat;
		var r  = this;
		for (var i=0; ( i < dt.length && i < this.pageCnt); i++) {
			var row = dt[i]; this['mode'] = (row['mode'])? row['mode'] : "DEFAULT";
			var l = this.layout[this.mode];
			for (var j=0;j<this.keyList[this.mode].length;j++) {
				var v = this.keyList[this.mode][j];
				var regexp = new RegExp("%"+v+"%","gi");
				
				var rowValue = (row[v])? row[v] : "";
				if (jex.isNull(this.formatter[v]))	l=l.replace(regexp,rowValue);
				else								l=l.replace(regexp,this.formatter[v]((rowValue)?rowValue:""));
			}
			
			
			var $l = $(l).appendTo(this.obj);
			$l.data("data",i);
//			if (typeof(r.onclickFn['DEFAULT'])=="function") $l.click(function() { r.onclickFn['DEFAULT'].apply(this, [dt[$(this).data("data")]]); });
			
			jex.setJexObj($l);
		
			for (var key in r.onclickFn) {
				if (key=="DEFAULT") { 
					$l.click(function() { r.onclickFn['DEFAULT'].apply(this, [dt[$(this).data("data")]]); }); 
				} else {
					$l.find("#"+key).click(function() {
						r.onclickFn[key].apply(this, [dt[function(r){
							while ($(r).parent().get(0).tagName.toUpperCase() != r.tag.toUpperCase()) {
								r = $(r).parent();
							}
							r = $(r).parent();
							return $(r).data("data");
						}(this)]]);
					}); 
				}
			}
		}
		this.obj.find(this.tag).show();
		if (typeof(resizeIframe)=="function") resizeIframe();
	}
});
jex.plugin.add("JEX_LIST", jexListPlugin, "data-jx-list");
})();