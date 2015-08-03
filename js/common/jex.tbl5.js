/**
 * Jex Tbl정의
 * 기능 요건
 *	01.	mobile append타입 지원
 *	02.	PAGING지원
 *	03.	확장성.
 *	04.	TABLE정의는 HTML에 정의되어 있는 것을 사용한다.
 *  
 *	05.	Table Data Set (tds)정의하자.
 *	06.	다중레이아웃지원
 */
(function() {
var JexTblException = Exception.extend({
	init:function(code, msg) {
		this._super(code, msg);
	},
	onError:function() {
		alert(this.getMessage());
	}
});


var tbl_attrs = {
	"id"			: "data-jx-table",
	"onclick" 		: "data-jx-table-onclick",
	"page"			: "data-jx-table-page",
	"pageBefore"	: "data-jx-table-page-before",
	"pageAfter"	    : "data-jx-table-page-after"
};

var PLUGIN_JEXTBL	= JexPlugin.extend({
	init : function(tbl) {
		this.dat 			= []; 
		this.obj 			= $(tbl);
		this.svrPageNo		= 1;
		this.lastSvrPageNo		= 1;
		this.drawCnt 			= -1;			// 해당 건수만큼 table row를 그려준다.
		this.paging			= false;		// 페이징 사용여부
		this.tbody			= this.obj.find("tbody");
		this.thead			= this.obj.find("thead");
		this.tfoot			= this.obj.find("tfoot");  		
//		this.pageCntPrefix	= "<li class=\"generated\"><a href=\"javascript:\"><img src=\"../images/btn_prev.png\"alt=\"이전 페이지\" /></a></li>";
//		this.pageCntPostfix	= "<li class=\"generated\"><a href=\"javascript:\"><img src=\"../images/btn_next.png\" alt=\"다음 페이지\" /></a></li>";
		
		this.pageCntPrefix	= "<li class=\"generated\"><a href=\"javascript:\"><img src=\"img/btn_prev.png\" alt=\"이전 페이지\" /><span class=\"blind\">이전 페이지</span></a></li>";
		this.pageCntPostfix	= "<li class=\"generated\"><a href=\"javascript:\"><img src=\"img/btn_next.png\" alt=\"다음 페이지\" /><span class=\"blind\">다음 페이지</span></a></li>";
		this.firstPageDiv		= "<li class=\"generated\"><a href=\"javascript:\"><img src=\"img/btn_first.png\" alt=\"처음 페이지\" /><span class=\"blind\">처음 페이지</span></a></li>";
		this.lastPageDiv		= "<li class=\"generated\"><a href=\"javascript:\"><img src=\"img/btn_last.png\" alt=\"마지막 페이지\" /><span class=\"blind\">마지막 페이지</span></a></li>";
		
		this.pageIdxOff		= "%PAGE_NO%";
		this.pageIdxSP		= "|";
		this.pageIdxOn		= "<b>%PAGE_NO%</b>";
		this.layout			= {};
		this.formatter		= jex.getSetAllFormatter();
		this.dfltStr			= "DEFAULT";
        this.emptyStr          = "EMPTY";
		this.rowNumStr		= "data-rowNum";
		this.pageHrefPrefix	= "<a href=\"#currentPage=%PAGE_NO_ORI%&svrPage=%SVR_PAGE_NO%\">";
		this.pageHrefpostfix	= "</a>";
		this.eventList		= {};
		this.onclick			= {};
		this.totalPage		= 0;
		this.currentPage		= 1;
		this.drawRowCnt		= 1;
		this.jm				= jex.getJobManager();
		this.onBeforeChange	= function() {};
        this.onAfterChange = function() {};
		this.maxPage;
		this.maxData;
		this.pageDiv;
		this.pageEvent		= false;
		this.hashCheckDely	= 500;		// Hash체크 시간(IE7이하 버젼용 :: 차후 필요시 외부에서 세팅하도록 인터페이스를 제공해주자.)
		this.setSvrPageSize(100);
		this.getLayout();
		this.setPageEvent();
		this.totalRows = 0;
		this.params = {};
		
		
		var hString = jex.getHString();
		this.currentPage		= parseInt(hString['currentPage'],	10);
		
	}, 
	load : function(attr, $jq){
		this.obj 			= $jq;
        //this.jexService     = this.obj.attr(attr);
		this.key            = this.obj.attr(attr);
		this.tbody			= this.obj.find("tbody");
		this.thead			= this.obj.find("thead");
		this.tfoot			= this.obj.find("tfoot");

		this.parseParams(this.obj.attr(tbl_attrs.id));
		this.parseOnclick(this.obj.attr(tbl_attrs.onclick));

		this.setPaging(this.obj.attr(tbl_attrs.page));

		var handleBefore = getMethodByNamespace(this.obj.attr(tbl_attrs.pageBefore));
		if (typeof handleBefore === 'function') {
			this.beforePageChange(handleBefore);
		}

        var handleAfterPageChange = getMethodByNamespace(this.obj.attr(tbl_attrs.pageAfter));
        if (typeof handleAfterPageChange === "function") {
            this.afterPageChange(handleAfterPageChange);
        }

		this.getLayout();
		this.setPageEvent();
	},
	draw : function() {
		if (!location.hash) {
			var hash = {};
			hash['currentPage']	=	(this.currentPage)?this.currentPage.toString():"1";
			hash['svrPage']		=	(this.svrPageNo)?this.svrPageNo.toString():"1";
			jex.setHString(hash);
		}  else {
			this.onPageChange();
		}
	}, prependData : function(data) {
		this.dat = data.concat(this.dat);
	}, getData : function(idx) {
		return this.dat[idx];
	}, getEvent : function(key) {
		var fn = this.eventList[key];
		if (typeof(fn) == "function") return fn;
		return function(){};
	}, addEvent : function(key, fn) {
		this.eventList[key] = fn;
	}, setDrawRowCnt	: function(n) {
		this.drawRowCnt = n;
	}, setPageCntPrefix	: function(s) {
		this.pageCntPrefix	= s;
	}, setPageCntPostfix : function(s) {
		this.pageCntPostfix	= s;
	}, hasNextSvrPage : function() {
		return this.dat.length > (this.maxPage * this.drawCnt);
//		if (this.dat.length > this.maxData)	return true;
//		else										return false;
	}, hasBeforeSvrPage : function() {
		if (this.svrPageNo <= 1)			return false;
		else									return true;
	}, getSvrPageSize : function() {
		return this.maxData;
	}, setTotalRows : function(i) {
		this.totalRows = i;
	}, getTotalRows : function() {
		return this.totalRows;
	}, setLastSvrPageNo : function(i) {
		this.lastSvrPageNo = i;
	}, getLastSvrPageNo : function() {
		return this.lastSvrPageNo;
	}, setSvrPageSize : function(i) {
		this.maxData = i;
		this.maxPage = parseInt((i-1) / this.drawCnt,10)+1;
	}, setSvrPageNo : function(i) {
		this.svrPageNo = i;
	}, getSvrPageNo : function() {
		return (isNaN(this.svrPageNo)?1:this.svrPageNo);
	}, setPageEvent : function() {
		if (!this.pageEvent) {
			var  _tblthis = this;
			if (window.addEventListener ) {
				window.addEventListener('hashchange', function() {
					_tblthis.onPageChange();
				},false);
			} else if (window.attachEvent) {
				this.beforeHash = location.hash;
				setInterval(function() {
					if (_tblthis.beforeHash==location.hash) return;
					_tblthis.onPageChange();
					_tblthis.beforeHash = location.hash;
				},this.hashCheckDely);
			}
			this.pageEvent = true;
		}
	}, beforePageChange : function(fn) {
		this.onBeforeChange = fn;
	},
    afterPageChange : function(fn) {
        this.onAfterChange = fn;
    },
    onPageChange : function() {
		var  _tblthis = this;
		this.jm.add(function() { _tblthis.onBeforeChange(_tblthis); });
		this.jm.add(function() { _tblthis._onPageChange(); });
        this.jm.add(function() { _tblthis.onAfterChange(_tblthis);  });
	}, _onPageChange : function() {
		var  _tblthis = this;
		var hString = jex.getHString();
		
		var currentPage = parseInt(hString['currentPage'],	10);
		currentPage = (isNaN(currentPage)?1:currentPage);
		
		var svrPage = parseInt(hString['svrPage'],	10);
		svrPage = (isNaN(svrPage)?1:svrPage);
		
		_tblthis.currentPage		= currentPage;
		
		if (_tblthis.svrPageNo	!= svrPage || this.dat.length == 0) {
			_tblthis.onSvrPageChange(svrPage);
		}
		else {
			_tblthis.clearTbl(true);
			_tblthis.drawTbl();
		}
	}, onSvrPageChange : function(svrPage) {
		this.svrPageNo = svrPage;
		this.getEvent("onSvrPageChange")(svrPage);
	}, drawPageIdx : function() {
		_tblThis = this;
		if (!this.pageDiv||this.pageDiv.length == 0) throw new JexTblException("TBL0004","Page Div가 지정되지 않았습니다.");
		var totalPage = this.getTotalPage(); 
		totalPage = (totalPage > this.maxPage)?this.maxPage:totalPage;
		
		var svrPageNo = this.getSvrPageNo();
		
		this.pageDiv.html("");
		this.pageDiv.parents("ul").find(".generated").remove();
		
		var displayedPages = parseInt(this.getSvrPageSize() / this.drawCnt, 10);
		
		
		for (var i=0;i<totalPage;i++) {
			if ((i+1)==this.getCurrentPage())	this.pageDiv.append(this.pageIdxOn.replace(/%PAGE_NO%/g,((svrPageNo-1)*displayedPages)+i+1).replace(/%PAGE_NO_ORI/,i+1).replace(/%SVR_PAGE_NO%/,this.svrPageNo));
			else									this.pageDiv.append((this.pageHrefPrefix+this.pageIdxOff+this.pageHrefpostfix).replace(/%PAGE_NO%/g,((svrPageNo-1)*displayedPages)+i+1).replace(/%PAGE_NO_ORI%/,i+1).replace(/%SVR_PAGE_NO%/,this.svrPageNo));
			if (i!=totalPage-1)					this.pageDiv.append(this.pageIdxSP);
		}
		
		var first = $(this.firstPageDiv);
		first.click(function() {
			if(_tblThis.getCurrentPage() == 1 && _tblThis.svrPageNo == 1) {
				alert("The first page");
				//jex.warning("첫번째 페이지입니다.");//첫번째 페이지입니다.
			}
			else {
				var hash = {};
				hash['currentPage']	=	"1";
				hash['svrPage']		=	"1";
				jex.setHString(hash);
			}
		});
		first.insertBefore(this.pageDiv.parent());
		
		
		var prefix = $(this.pageCntPrefix);
		
//		if (_tblThis.hasBeforeSvrPage()) prefix.appendTo(this.pageDiv);
		
		if (_tblThis.hasBeforeSvrPage()) {
//			prefix.click(function() {
//				var hash = {};
//				hash['currentPage']	=	"1";
//				hash['svrPage']		=	(_tblThis.svrPageNo)?(_tblThis.svrPageNo-1).toString():"1";
//				jex.setHString(hash);
//			});
		}
		else {
			prefix.click(function() {
				//jex.warning(_extLang.noPreviousPage); //이전페이지가 존재하지 않습니다. 
				alert("The previous page does not exist.");
		 	
			});
		}

		prefix.insertBefore(this.pageDiv.parent());
		
		var last = $(this.lastPageDiv);

		last.click(function() {
			var lastPage = Math.ceil(_tblThis.getTotalRows() / _tblThis.drawCnt);
			var lastSvrPageNo = _tblThis.getLastSvrPageNo();
			
			//if (_tblThis.hasNextSvrPage()) {
				//currentPage = Math.ceil(lastPage / _tblThis.maxPage);
				currentPage = ((lastPage - 1) % _tblThis.maxPage) + 1;
				
				
			//}
			//else {
			//	currentPage = lastPage;
			//}
				
			if(currentPage == _tblThis.currentPage && _tblThis.svrPageNo == lastSvrPageNo) {
				//jex.warning(_extLang.lastPage); // 마지막 페이지입니다. 
				alert("The last page");
				} 
			else {
				var hash = {};
				hash['currentPage']	=	currentPage;
				hash['svrPage']		=	lastSvrPageNo;
				
				jex.setHString(hash);
			}
		});
		last.insertAfter(this.pageDiv.parent());
		
		
		
		var postfix = $(this.pageCntPostfix);
		
//		if (_tblThis.hasNextSvrPage()) postfix.appendTo(this.pageDiv);
		
		if (_tblThis.hasNextSvrPage()) {
//			postfix.click(function() {
//				
//				var hash = {};
//				hash['currentPage']	=	"1";
//				hash['svrPage']		=	(_tblThis.svrPageNo)?(_tblThis.svrPageNo+1).toString():"1";
//				jex.setHString(hash);
//			});
//			postfix.insertAfter(this.pageDiv.parent());
		}
		else {
			postfix.click(function() {
				alert("The next page does not exist");
			//	jex.warning(_extLang.noNextPage);//다음페이지가 존재하지 않습니다.
			});
		}

		postfix.insertAfter(this.pageDiv.parent());
		
		prefix.css("cursor","pointer");
		postfix.css("cursor","pointer");
		
		if (this.eventList["onSvrPageChange"]) {
			prefix.click(function() {
				var hash = {};
				hash['currentPage']	=	(this.currentPage)?this.currentPage.toString():"1";
				hash['svrPage']		=	(_tblThis.svrPageNo)?(_tblThis.svrPageNo-1).toString():"1";
				if (_tblThis.hasBeforeSvrPage()) jex.setHString(hash);
			});
			postfix.click(function() {
				var hash = {};
				hash['currentPage']	=	(this.currentPage)?this.currentPage.toString():"1";
				hash['svrPage']		=	(_tblThis.svrPageNo)?(_tblThis.svrPageNo+1).toString():"1";
				if (_tblThis.hasNextSvrPage()) jex.setHString(hash);
				console.log(hash);
			});
		}
		
		if (!location.hash) {
			var hash = {};
			hash['currentPage']	=	(this.currentPage)?this.currentPage.toString():"1";
			hash['svrPage']		=	(this.svrPageNo)?this.svrPageNo.toString():"1";
			jex.setHString(hash);
			//location.hash = this.currentPage.toString();
		} 
	}, setCurrentPage : function(page) {
		if (!this.paging) {
			throw new JexTblException("TBL0002", "페이징 처리시에만 지원되는 기능입니다.");
		}
		this.currentPage = page;
	}, getCurrentPage : function() {
		if (!this.paging)	 throw new JexTblException("TBL0002", "페이징 처리시에만 지원되는 기능입니다.");
		return this.currentPage;
	}, getTotalPage : function() {
		if (!this.paging)	 throw new JexTblException("TBL0002", "페이징 처리시에만 지원되는 기능입니다.");
		this.totalPage = parseInt(((this.dat.length - 1) / this.drawCnt),10) + 1;
		return this.totalPage;
	}, setPageIdx : function(on, off, sp) {
		this.pageIdxOn	= on;
		this.pageIdxOff = off;
		this.pageIdxSP	= sp;
	}, setPageDiv : function(div) {
		this.pageDiv = $(div);
	}, clearTbl : function(b) {
		if (!b) this.dat = [];
		this.tbody.find("tr").remove();
	}, addFormatter : function(key, fn) {
		this.formatter[key] = fn;
	}, onClick : function() {
		if (arguments.length == 1)	this.onclick[this.dfltStr]	= arguments[0];
		else							this.onclick[arguments[0]]	= arguments[1];
	}, addLayOut : function(key, str) {
		this.layout[key] = str;
	}, getLayout : function() {
		var trlist = this.tbody.find("tr");
		trlist.hide();
		if (trlist.length == 0) return;
	
		for (var i=0; i<trlist.length; i++) {
			var trid	= $(trlist[i]).attr("id");
			var rowstr	=  $('<p>').append($(trlist[i]).eq(0).clone()).html();
		
			if (!trid || trid =="") {
				if (!this.layout[this.dfltStr]) this.addLayOut(this.dfltStr, rowstr);
			} else {
				if (!this.layout[trid]) {
					this.addLayOut(trid, rowstr);
				} else {
					this.addLayOut(trid, this.layout[trid]+rowstr);
				}
			}
		}
		
		trlist.remove();
	}, setDrawCnt : function(cnt) {
		this.drawCnt = cnt;
	}, setAll : function(data,layout) {
		
		//console.log(this.layout);
		
		this.clearTbl();

        if (data || data.length > 0) {
            if (data[this.key] != null) {
                this.dat = data[this.key];
            } else {
                this.dat = data;
            }

            this.drawTbl(layout);
            
        } else {
            if (this.layout[this.emptyStr]) {
                this.addRow({}, 0, this.emptyStr);
            }
        }
	}, append : function(data) {
		this.dat = this.dat.concat(data);
		this.drawTbl();
	}, getRowNum : function(r) {		// ROWNUM을 return
		return $(this.getParentTr(r)).attr(this.rowNumStr);
	}, getParentTr : function(r) {		// 자신의 상위 TR을 찾아줌.
		while ($(r).get(0).tagName.toUpperCase() != "TR") r = $(r).parent().get(0);
		return r;
	}, update : function(rowNum, dat) {	// 자신의 상위 TR을 찾아줌.
		this.dat[rowNum] = dat;
		this.tbody.find("["+this.rowNumStr+"="+rowNum+"]").setAll(dat,this.formatter);
	}, addNRow : function(data) {
		jex.printDebug("추가할 Row :: "+data.length);
		for (var i=0; i<data.length; i++) {
			this.addRow(data[i]);
		}
	}, addRow : function(data,i,layout) {
		
		var lo			= (layout)?layout:this.dfltStr;

		if (typeof data === "object" && data['JEX_LAYOUT']) lo = data['JEX_LAYOUT'];
		
		if (!this.layout[lo]) lo = this.dfltStr;
			
		var nRow		= $(this.layout[lo]);
		
		var _tblthis	= this;
		if (i == undefined) {
			if (this.paging)  throw new JexTblException("TBL0003", "페이징 처리시 지원되지 않는 기능입니다.");
			i = this.dat.length;
			this.dat.push(data);
		}

		jex.setJexObj(nRow);
		nRow.setAll(data,this.formatter);
		nRow.show();
		
		nRow = nRow.appendTo(this.tbody);
		nRow.attr(this.rowNumStr,i);
		nRow.data("_JEX_GETALL_DATA_",data);
	
		for (var kkey in this.onclick) {
			var evtObj;
			if (kkey==this.dfltStr) evtObj = nRow;
			else					evtObj = nRow.find("#"+kkey);
			evtObj.css("cursor","pointer");
//			evtObj.click(function() { _tblthis.onclick[jex.isNull($(this).attr("id"))?_tblthis.dfltStr:$(this).attr("id")].apply(this, [_tblthis.dat[$(_tblthis.getParentTr(this)).attr(_tblthis.rowNumStr)]]); });
			evtObj.click(function() {
				var id = jex.isNull($(this).attr("id"))? _tblthis.dfltStr:	$(this).attr("id");
				var fn = (_tblthis.onclick[id])? _tblthis.onclick[id]: _tblthis.onclick[_tblthis.dfltStr];
				fn.apply(this, [_tblthis.dat[$(_tblthis.getParentTr(this)).attr(_tblthis.rowNumStr)]]);
			});
		}
	}, deleteRow : function(rowNum) {
		if (this.paging)  throw new JexTblException("TBL0003", "페이징 처리시 지원되지 않는 기능입니다.");
		this.dat[rowNum] = {};
		this.tbody.find("["+this.rowNumStr+"="+rowNum+"]").remove();
	}, page : function(b) {
		this.paging = b;
	}, isEmptyJSON : function(obj) {
		for(var i in obj) { return false; }
		return true;
	}, getAll : function() {
		var rslt = [];
		for (var i=0; i<this.dat.length; i++) if (!this.isEmptyJSON(this.dat[i])) rslt.push(this.dat[i]);
		return rslt;
	}, drawTbl: function(layout) {
		var strIdx = 0;
		var endIdx = this.dat.length;
		
		if (this.paging) {
			strIdx = (this.currentPage*this.drawCnt)-this.drawCnt;
			endIdx = (endIdx > (strIdx+this.drawCnt))?(strIdx+this.drawCnt):endIdx;
		} else {
			if (this.drawCnt > 0) endIdx = this.drawCnt;
		}
		for (var i=strIdx; i<endIdx; i++) this.addRow(this.dat[i],i,layout);
		if (this.paging) this.drawPageIdx();
		
		if(this.getEvent("onAfterDrawTbl")) this.getEvent("onAfterDrawTbl")();
	},
	parseParams : function(inputParams){
		if (typeof inputParams !== 'string' || inputParams.length == 0)		return;

		var keyValueList 	= inputParams.split(";"),
			i,
			length						= keyValueList.length,
			keyValue,
			key,
			value;

		for(i = 0; i < length; i++){
			keyValue = keyValueList[i].split(":");
			if (keyValue.length != 2)		continue;

			key = $.trim(keyValue[0]);
			value = $.trim(keyValue[1]);

			if (typeof key !== 'string' || key.length == 0 || typeof value != 'string' || value.length == 0)		continue;

			this.params[key] = value;
		}
	},
	parseOnclick : function(userInput){
		if (typeof userInput !== 'string' || userInput.length == 0)		return;

		var onClickKeyValueList 		= userInput.split(";"),
			onClickKeyValueListLength 	= onClickKeyValueList.length,
			i,
			onClickKeyValue,
			targetObjectId,
			handleMethod,
			handler;

		for (i = 0; i < onClickKeyValueListLength; i++) {
			onClickKeyValue = onClickKeyValueList[i].split(":");

			if (onClickKeyValue.length == 0 || onClickKeyValue.length > 2)		continue;

			if (onClickKeyValue.length == 1) {
				handleMethod = $.trim(onClickKeyValue[0]);
			} else if (onClickKeyValue.length == 2) {
				targetObjectId = $.trim(onClickKeyValue[0]);
				targetObjectId = (targetObjectId.startsWith("#"))? targetObjectId.substring(1) : targetObjectId;
				handleMethod = $.trim(onClickKeyValue[1]);
			}

			handler = getMethodByNamespace(handleMethod);

			if (typeof handler === 'function') {
				if (typeof targetObjectId === 'string') {
					this.onClick(targetObjectId, handler);
				} else {
					this.onClick(handler);
				}
			}
		}
	},

	/**
	 * @param userInput {string}  "key: value; key: value; key: value; ..."
	 *
	 *		div (*)
	 *			필수 값. page 에 대한 정보가 나타날 div id를 입력해준다. ex) #myDiv
	 *		per
	 *			페이지 당 표시되는 row 의 수. 기본 20 개
	 *		max
	 *			페이지에 나타날 최대 데이터의 수. 기본 100 개
	 *		onTag
	 *			페이지가 활성화 되었을 때 페이지 번호에 대한 태그. %PAGE_NO% 는 페이지 번호를 replace 시켜준다. 기본 <b>%PAGE_NO%</b>
	 *		offTag
	 *			페이지가 비활성화 상태일 때(즉 선택되지 않은 다른 페이지) 페이지 번호에 대한 태그. 기본 %PAGE_NO%
	 *		seperator
	 *			페이지와 페이지 사이에 나타날 구분자. 기본 '|'
	 */
	setPaging : function(userInput) {
		if (typeof userInput !== 'string' || userInput.length == 0)			return;

		var input 			= getQueryMapByQueryString(userInput),
		pageDiv 		= input["div"],
		drawCnt 		= (input["per"])? 		parseInt(input["per"]) 	: 20,
		svrPageSize 	= (input["max"])? 		parseInt(input["max"]) 		: drawCnt * 10,
		onTag			= (input["onTag"])? 	input["onTag"] 				: "<a class='on'>%PAGE_NO%</a>",
		offTag			= (input["offTag"])?	input["offTag"]				: "%PAGE_NO%",
		seperator		= (input["seperator"])?	input["seperator"]			: " ";
		
		if (typeof pageDiv !== 'string' || pageDiv.length == 0 || !pageDiv.startsWith("#")) {
			throw new JexTblException("..", "setPaging() : " + tbl_attrs.page + " 의 값이 올바르지 않습니다.");
		}

		this.page(true);
		this.setPageDiv(pageDiv);
		this.setPageIdx(onTag, offTag, seperator);
		this.setDrawCnt(drawCnt);
		this.setSvrPageSize(svrPageSize);
	}
});

/**
 * window scope 에서 접근 가능한 namespace.method 에 대해서 '.' 을 seperator 로 하여 method 객체를 리턴해준다.
 * @param namespace {String} "my.object.methodName"
 * @returns function YourMethod() || null
 */
function getMethodByNamespace(namespace){
	if (typeof namespace !== 'string' || namespace.length == 0)							return null;

	var namespaceSplit 			= namespace.split("."),
		namespaceSplitLength 	= namespaceSplit.length,
		handleMethod 			= window[namespaceSplit[0]],
		i;


	if (typeof handleMethod !== 'object' && typeof handleMethod !== 'function')			return null;

	for (i = 1; i < namespaceSplitLength; i++) {
		handleMethod = handleMethod[namespaceSplit[i]];

		if (typeof handleMethod !== "object" && typeof handleMethod !== 'function')		return null;
	}

	return handleMethod;
}

/**
 * String 으로 입력된 key-value 쌍을 object 형식으로 만들어준다.
 * @param input {String} "key1: value1; key2: value2; key3: value3; ..."
 * @returns { key1: value1, key2: value2, key3: value3 }
 */
function getQueryMapByQueryString(input){
	if (typeof input !== 'string' || input.length == 0)		return {};

	var result 				= {},
		keyValueList 		= input.split(";"),
		keyValueListLength 	= keyValueList.length,
		keyValueSplit,
		key,
		value,
		i;

	for (i = 0; i < keyValueListLength; i++) {
		keyValueSplit = keyValueList[i].split(":");

		if (keyValueSplit.length != 2)		continue;

		key 	= $.trim(keyValueSplit[0]);
		value 	= $.trim(keyValueSplit[1]);

		result[key] = value;
	}

	return result;
}

jex.plugin.add("JEX_TBL", PLUGIN_JEXTBL, "data-jx-table");

})();