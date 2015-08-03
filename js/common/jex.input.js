/**
 * INPUT BOX Handler
 * 
 * 현재는 Jquery를 사용하는데 Jquery를 사용하지 않는 곳도 있을수 있으니 그것을 염두에 두어야 한다.
 * 일단 Jquery로 코딩
 *
 * 사용예) <input type="text" data-input="lower2Upper antiWhiteSpace"/>
 *        ->두개 이상 적용할경우 띄어쓰기로 구분함.
 * 
 * @author 김학길
 */
{
var plugin_inputBox = JexPlugin.extend({
	init : function()
	{
		this._super();
		this.checker = "[data-input]";
		this.attrNm = "data-input";
		_this = this;
		this.commonKeyCode = [4,6,8,9,13,46,37,39];
	},
	/**
	 * 공통으로 처리할 keycode
	 **/
	isCommonKeyCode : function(code) {
		for (var i=0; i<this.commonKeyCode.length; i++) {
			if (this.commonKeyCode[i] == code) return true;
		}
		return false;
		
	},
	lower2Upper : function($e)
	{
		$e.blur(function(event){
			$(this).val( ($(this).val()).toUpperCase() );
		});
	},
	/**
	 * 인풋에 값 입력후 blur시 대문자를 소문자로 변환해준다. 
	 * 
	 * 사용법: data-input="upper2lower"
	 */
	upper2lower : function($e)
	{
		$e.blur(function(event){
			$(this).val( ($(this).val()).toLowerCase() );
		});
	},
	
	/**
	 * 숫자외에는 입력급지
	 * 
	 * 사용법: data-input="onlyNumber"
	 */
	onlyNumber : function($e)
	{
		
		
		/*var _this = this;
		$e.keydown(function(event){
			var code = _this.getKeyCode(event);
			if (_this.isCommonKeyCode(code)) return true;
			if( code>=48 && code<=57) {
				return true; 
			} else {
				return false;
			}
		});*/
		// read only number
		var _this = this;
		$e.keydown(function(event){
			var code = _this.getKeyCode(event);
			//var code = (event.which) ? event.which: event.keyCode;
			if (_this.isCommonKeyCode(code)) return true;
			if((code < 96 || code > 105) &&  ( code < 48 || code > 57)) {
				return false; 
			} else {
				return true;
			}
		});
		
		$(this).css("ime-mode","inactive");
		
//		$e.keypress(function(event){
//			if(isNaN(String.fromCharCode(event.keyCode))) {
//				event.preventDefault();
//			}
//		});

		$e.blur(function(event){
			var Re = /[^0-9]/g;
			$(this).val($(this).val().replace(Re,''));
		});	
	},
	/**
	 * 숫자외에는 입력급지, 입력후 금액 comma표현
	 * 
	 * 사용법: data-input="commaFormat"
	 */
	commaFormat : function($e)
	{
		this.onlyNumber($e);
		$e.blur(function(event){
			$(this).val( _this.commify($(this).val()));
		});
	},
	/**
	 * 영문만 입력
	 * 
	 * 사용법: data-input="onlyEng"
	 */
	onlyEng : function($e)
	{
		$e.keydown(function(event){
			var code = _this.getKeyCode(event);
			if( code>=90/*number 9*/ || code<=65/*number 0*/ )
			{
				return false; 
			}
		});
	},
	/**
	 * 한글만 입력
	 * 
	 * 사용법: data-input="onlyKor"
	 */
	onlyKor : function($e)
	{
		$e.keydown(function(event){
			var code = _this.getKeyCode(event);
			if(!(code < 47 && code > 58)) return false;
		});
	},
	/**
	 * DateFormat
	 * 
	 * 사용법: data-input="dateFormat"
	 */
	dateFormat : function($e)
	{
		$e.blur(function(event){
			var result = $(this).val();
			if (result.length == 8) { 
				result = result.substring(0,4)+"-"+result.substring(4,2)+"-"+result.substring(6,2);
				$(this).val( result );
			}
		});
	},
	/**
	 * 좌측정렬
	 * leftFormat
	 * 
	 * 사용법: data-input="leftFormat"
	 */	
	leftFormat : function($e)
	{
	},	
	/**
	 * 우측정렬
	 * rightFormat
	 * 
	 * 사용법: data-input="rightFormat"
	 */	
	rightFormat : function($e)
	{
	},
	/**
	 * 중앙정렬
	 * centerFormat
	 * 
	 * 사용법: data-input="centerFormat"
	 */	
	centerFormat : function($e)
	{
	},
	/**
	 * 소수점 포함 금액
	 * commaPointFormat
	 * 
	 * 사용법: data-input="commaPointFormat"
	 */	
	commaPointFormat : function($e)
	{
	},
	/**
	 * 주민등록번호
	 * ssnFormat
	 * 
	 * 사용법: data-input="ssnFormat"
	 */	
	ssnFormat : function($e)
	{
	},
	/**
	 * 사업자번호
	 * bizFormat
	 * 
	 * 사용법: data-input="bizFormat"
	 */		
	bizFormat : function($e)
	{
	},
	/**
	 * 계좌번호
	 * accFormat
	 * 
	 * 사용법: data-input="accFormat"
	 */		
	accFormat : function($e)
	{
	},
	/**
	 * 신용카드
	 * cardFormat
	 * 
	 * 사용법: data-input="cardFormat"
	 */		
	cardFormat : function($e)
	{
	},
	/**
	 * 해당 인풋에 공백(space)를 입력하지 못하도록한다.
	 * 붙여넣기 등으로 공백이 존재할경우에도 blur시 공백을 제거함
	 * 
	 * 사용법: data-input="antiWhiteSpace"
	 */
	antiWhiteSpace : function($e)
	{
		$e.keydown(function(event){
			var code = _this.getKeyCode(event);
			if( code==32 )
			{
				return false; 
			}
		});
		$e.blur(function(event){
			if(/ /g.test($(this).val()))
			{
				$(this).val( ($(this).val()).replace(/ /g, ""));
			}
		});
	},
	/**
	 * 해당 인풋에 설정된 최소값 이하로 입력 제한을 한다.
	 * 
	 * 사용법: data-input="minValue" allowable_data="5"
	 */
	minValue : function($e)
	{

	},	
	/**
	 * 해당 인풋에 설정된 최대값 이상으로 입력 제한을 한다.
	 * 
	 * 사용법: data-input="maxValue" allowable_data="10"
	 */
	maxValue : function($e)
	{

	},	
	/**
	 * 해당 인풋에 설정된 길이 이하로 입력시 제한을 한다.(Byte단위)
	 * 
	 * 사용법: data-input="minLang" allowable_data="5"
	 */
	minLang : function($e)
	{

	},	
	/**
	 * 해당 인풋에 설정된 길이 이상으로 입력시 제한을 한다.(Byte단위)
	 * 
	 * 사용법: data-input="maxLang" allowable_data="5"
	 */
	maxLang : function($e)
	{

	},		
	/**
	 * 해당 인풋에 설정된 특수문자만 입력 허용한다.
	 * 
	 * 사용법: data-input="specialChar" allowable_data="%,$,@"
	 */
	specialChar : function($e)
	{

	},	
	/**
	 * 해당 인풋에 이메일 입력 후 blur시 유효성 검사를 한다.
	 * 
	 * 사용법: data-input="emailValid"
	 */	
	emailValid : function($e)
	{
		
	},
	/**
	 * 해당 인풋에 주민등록번호 입력 후 blur시 유효성 검사를 한다.
	 * 
	 * 사용법: data-input="ssnValid"
	 */	
	ssnValid : function($e)
	{
		
	},	
	/**
	 * 해당 인풋에 사업자등록번호 입력 후 blur시 유효성 검사를 한다.
	 * 
	 * 사용법: data-input="bizValid"
	 */	
	bizValid : function($e)
	{
		
	},		
	/**
	 * 해당 인풋에 핸드폰번호 앞자리 입력 후 blur시 유효성 검사를 한다.
	 * 
	 * 사용법: data-input="mibileNumValid"
	 */	
	mobileNumValid : function($e)
	{
		
	},			
	/**
	 * 해당 인풋에 지역번호 입력 후 blur시 유효성 검사를 한다.
	 * 
	 * 사용법: data-input="telNumValid"
	 */	
	telNumValid : function($e)
	{
		
	},	
	/**
	 * 해당 인풋에 계좌번호 입력 후 blur시 유효성 검사를 한다.
	 * 
	 * 사용법: data-input="accNumValid"
	 */		
	accNumValid : function($e)
	{
		
	},
	
	
	
	
	
	
	
	
	
	
	
	
	getKeyCode : function(e) {
		var code;
		if (!e) e = window.event;

		if (!!e.keyCode) code = e.keyCode;
		else if(e.which) code = e.which;
		
		return code;
	}, commify : function(n) {
		  var reg = /(^[+-]?\d+)(\d{3})/;   // 정규식
		  n += '';                          // 숫자를 문자열로 변환

		  while (reg.test(n)) n = n.replace(reg, '$1' + ',' + '$2');

		  return n;
	}
});

jex.plugin.add("INPUT_BOX", new plugin_inputBox());

}

$(document).ready(function(){
	
	var plugin = jex.plugin.get("INPUT_BOX");
	
	var $inList = $(document).find("[data-input]");
	
	$.each($inList, function(i,v){
		var execList = $(v).attr("data-input").split(/ /g);

		for(var k=0 ; k<execList.length ; k++)
		{
			var key = execList[k];
			if(!!key && typeof plugin[key] == "function")
			{
				plugin[key]( $(v) );
			}
		}
	});
});
// number read only for data-input
/*function isNumberKey(evt)
{
   var charCode = (evt.which) ? evt.which : event.keyCode;
   if (charCode > 31 && (charCode < 48 || charCode > 57))
      return false;

   return true;
}*/