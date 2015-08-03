var gbox;
if(!gbox) gbox={};	

if(!gbox.ui) {
	gbox.ui={};
	gbox.ui.receiverData = [];
	
	$(function() {
//		$.datepicker.setDefaults({
//			setDate: "-0d",
//			defaultDate: "-0d",
//			changeYear: true,
//			changeMonth: true,
////			numberOfMonths: 3,
//			dateFormat: 'yy-mm-dd',
//			timeFormat: 'HH:mm'
//		});
//		
//		
//		if(toastr) {
//			toastr.options = {
//				"closeButton": true,
//				"debug": false,
//				"positionClass": "toast-bottom-left",
//				"onclick": null,
//				"showDuration": "300",
//				"hideDuration": "1000",
//				"timeOut": "5000",
//				"extendedTimeOut": "1000",
//				"showEasing": "swing",
//				"hideEasing": "linear",
//				"showMethod": "fadeIn",
//				"hideMethod": "fadeOut"
//			};
//		};
//		
//		$.each($("[data-ui-component]"), function(i, v) {
//			gbox.ui.setUiComponent(v, {
//				"component":$(this).attr("data-ui-component")
//			});
//		});
	});
//	
	
	//link append to show
	gbox.ui.setappdenLink = function (target, appcdNo) {
		
		var jexAjax = jex.createAjaxUtil("pc_link_r002");
		jexAjax.set("APPCD_NO", appcdNo);
		jexAjax.execute(function(dat) {
//			var valueField = "APPCD_NO";
//			var labelField = "APP_NM";
			//$(target).find("option[data-generated='option']").remove();
			
//			$.each(dat.INQ_REC, function(i, v) {
//				if(i==0){
				var linkUrl = jex.null2Void(dat.WEB_URL);
				if(jex.isNull(linkUrl)) {
					linkUrl = "javascript:jex.warning('웹 화면에서는 제공되지 않는 기능입니다.');";
				}
				var txt="<span id=\"linktype\"><a href=\""+linkUrl+"\" target=\"_blank\" data-value="+dat.APPCD_NO+" class=\"linkview\">"+dat.APP_NM+"</a><a class=\"removeLink\" href=\"javascript:\"><img src=\"../img/ico/ico_delete.gif\" alt=\"삭제\"></a></span>";
				$(".msg_linkview div").empty().append(txt);
				$(".msg_linkview").show();
//				}
//			});
		});
	};
	

	//링크정보 콤보박스
	gbox.ui.setLinkAppCombo = function(target, json) {
		var valueField = "APPCD_NO";
		var labelField = "APP_NM";
		var labelUrl = "WEB_URL";
		var defaultValue = null;
		
		if(json) {
			if(json.valueField) {
				valueField = json.valueField;
			}
			
			if(json.labelField) {
				labelField = json.labelField;
			}
			
			if(json.defaultValue) {
				defaultValue = json.defaultValue;
			}
		}
		
		
		
		var jexAjax = jex.createAjaxUtil("pc_link_r001");
		jexAjax.execute(function(dat) {
			$(target).find("option[data-generated='option']").remove();
			
			$.each(dat.INQ_REC, function(i, v) {
				if(defaultValue == v[valueField]) {
					$(target).append("<option selected data-url_link='"+v[labelUrl]+"' data-generated=\"option\" value='"+v[valueField]+"'>"+v[labelField]+"</option>");
				}
				else {
					$(target).append("<option data-url_link='"+v[labelUrl]+"' data-generated=\"option\" value='"+v[valueField]+"'>"+v[labelField]+"</option>");
				}
			});
			
			gbox.ui.setUiComponent($(target).closest("div.select_field_cbox"), {
				component:"select"
			});
			//var txt="<span id=\"linktype\"><a href=\"javascript:\"  data-value=\"12121\" class=\"linkview\">\"+v[labelField]+\"</a><a class=\"removeLink\" href=\"javascript:\"><img src=\"../img/ico/ico_delete.gif\" alt=\"삭제\"></a></span>";
			//$(".msg_linkview div").empty().append(txt);
//			$(target).select2({
//				minimumResultsForSearch: -1,
//				dropdownAutoWidth: true,
//				placeholder: "선택하세요."
//			});
		});
	};
	
	
	//받는이정보 입력박스
	gbox.ui.setReceiverInput = function(target, callbackFn) {
		
		var receiverData = [];
		
		var jexAjax = jex.createAjaxUtil("pc_receiver_r001");
		jexAjax.execute(function(dat) {
			
			$.each(dat.USER_REC, function(i, v) {
				// receiverData.push({id: "USER_" + v.USER_NO, text: "[개인]" + v.USER_NM});
				
				var label;
				
				if(/\@J$/.test(v.USER_NO)) {
					label = "[직원]";
				}
				else if(/\@Y$/.test(v.USER_NO)) {
					label = "[연락처]";
				}
				else {
					label= _extLang.privates;
				}
				
				receiverData.push({id: "USER_" + v.USER_NO, text: label + v.USER_NM});
			});
			
			$.each(dat.GROUP_REC, function(i, v) {
				//receiverData.push({id: "GROUP_" + v.GROUP_NO, text: "[그룹]" + v.GROUP_NM});
				
				var label;
				
				if(/\@J$/.test(v.GROUP_NO)) {
					label = "[직원그룹]";
				}
				else if(/\@Y$/.test(v.GROUP_NO)) {
					label = "[연락처그룹]";
				}
				else {
					label= _extLang.group;
				}
				
				receiverData.push({id: "GROUP_" + v.GROUP_NO, text:  label  + v.GROUP_NM});
			});
			
			
			$(target).select2({
				multiple: true,
				data: receiverData
			});
			
			if(callbackFn) callbackFn(receiverData);
		});
		
//		receiverData.push({id: "GROUP_1", text: "group1"});
//		receiverData.push({id: "GROUP_2", text: "group2"});
//		receiverData.push({id: "GROUP_3", text: "group3"});
//		receiverData.push({id: "USER_1", text: "user1"});
//		receiverData.push({id: "USER_2", text: "user2"});
//		receiverData.push({id: "USER_3", text: "user3"});
		
		
		
		/*
		$.each($(".select2-container"), function (i, n) {
	        $(n).next().show().fadeTo(0, 0).height("0px").css("left", "auto"); // make the original select visible for validation engine and hidden for us
	        $(n).prepend($(n).next());
	        $(n).delay(500).queue(function () {
	            $(this).removeClass("validate[required]"); //remove the class name from select2 container(div), so that validation engine dose not validate it
	            $(this).dequeue();
	        });
	    });
	    */
		
	};
	
	//받는이정보 입력박스
	gbox.ui.setReceiverInputAjax = function(target, callbackFn) {
		$(target).select2({
			multiple: true,
	        minimumInputLength: 2,
	        maximumInputLength: 20,
			ajax: {
	            url: "/pc_receiver_r001.jct",
	            dataType: 'json',
	            data: function(term, page) {
	                return {
	                	"_JSON_":encodeURIComponent(JSON.stringify({"INQ_KEYWORD":term}))
	                };
	            },
	            results: function(dat) {
	            	
	            	var receiverData = [];
	            	
	            	$.each(dat.USER_REC, function(i, v) {
	        			// receiverData.push({id: "USER_" + v.USER_NO, text: "[개인]" + v.USER_NM});
	        			
	        			var label;
	        			
	        			if(/\@J$/.test(v.USER_NO)) {
	        				label = "[직원]";
	        			}
	        			else if(/\@Y$/.test(v.USER_NO)) {
	        				label = "[연락처]";
	        			}
	        			else {
	        				label= _extLang.privates;
	        			}
	        			
	        			receiverData.push({id: "USER_" + v.USER_NO, text: label + v.USER_NM});
	        		});
	        		
	        		$.each(dat.GROUP_REC, function(i, v) {
	        			//receiverData.push({id: "GROUP_" + v.GROUP_NO, text: "[그룹]" + v.GROUP_NM});
	        			
	        			var label;
	        			
	        			if(/\@J$/.test(v.GROUP_NO)) {
	        				label = "[직원그룹]";
	        			}
	        			else if(/\@Y$/.test(v.GROUP_NO)) {
	        				label = "[연락처그룹]";
	        			}
	        			else {
	        				label= _extLang.group;
	        			}
	        			
	        			receiverData.push({id: "GROUP_" + v.GROUP_NO, text:  label  + v.GROUP_NM});
	        		});
	            	
	                return {
	                    results: receiverData
	                };
	                
	                
	                if(callbackFn) callbackFn(receiverData);
	            }
	        },
	        initSelection: function(element, callback) {
	        	var data = $(target).select2("data");
	        	
	        	callback(data);
	        	
	        	/*
                
                
                $(element.val().split(",")).each(function(i, v) {
//                    var item = this.split(':');
                    data.push({
                        id: this,
                        text: this
                    });
                });
                callback(data);
                */
            }
		});
		
		
//		$(target).select2("readonly", true);
		
		/*
		var receiverData = [];
		
		var jexAjax = jex.createAjaxUtil("pc_receiver_r001");
		jexAjax.execute(function(dat) {
			
			$.each(dat.USER_REC, function(i, v) {
				// receiverData.push({id: "USER_" + v.USER_NO, text: "[개인]" + v.USER_NM});
				
				var label;
				
				if(/\@J$/.test(v.USER_NO)) {
					label = "[직원]";
				}
				else if(/\@Y$/.test(v.USER_NO)) {
					label = "[연락처]";
				}
				else {
					label= _extLang.privates;
				}
				
				receiverData.push({id: "USER_" + v.USER_NO, text: label + v.USER_NM});
			});
			
			$.each(dat.GROUP_REC, function(i, v) {
				//receiverData.push({id: "GROUP_" + v.GROUP_NO, text: "[그룹]" + v.GROUP_NM});
				
				var label;
				
				if(/\@J$/.test(v.GROUP_NO)) {
					label = "[직원그룹]";
				}
				else if(/\@Y$/.test(v.GROUP_NO)) {
					label = "[연락처그룹]";
				}
				else {
					label= _extLang.group;
				}
				
				receiverData.push({id: "GROUP_" + v.GROUP_NO, text:  label  + v.GROUP_NM});
			});
			
			
			
		});
		*/
		
//		receiverData.push({id: "GROUP_1", text: "group1"});
//		receiverData.push({id: "GROUP_2", text: "group2"});
//		receiverData.push({id: "GROUP_3", text: "group3"});
//		receiverData.push({id: "USER_1", text: "user1"});
//		receiverData.push({id: "USER_2", text: "user2"});
//		receiverData.push({id: "USER_3", text: "user3"});
		
		
		
		/*
		$.each($(".select2-container"), function (i, n) {
	        $(n).next().show().fadeTo(0, 0).height("0px").css("left", "auto"); // make the original select visible for validation engine and hidden for us
	        $(n).prepend($(n).next());
	        $(n).delay(500).queue(function () {
	            $(this).removeClass("validate[required]"); //remove the class name from select2 container(div), so that validation engine dose not validate it
	            $(this).dequeue();
	        });
	    });
	    */
		
		
	};

	
	
	gbox.ui.setSingleFileUploader = function(target, json) {
		
		var url = "/upload";
		
		if(json.allowedExts) {
			url += "?allowedExts=" + json.allowedExts;
		}

		$(target).attr("placeholder", "파일을 선택하세요.");
		//$(target).attr("type", "file");
		$(target).attr("name", "files[]");
		$(target).attr("data-url", "/upload");
		
		//change 이벤트 설정
		$(json.keyTarget).bind("change", function() {
			$(target).parent().find(".generated").remove();
			
			if(jex.isNull($(json.keyTarget).val())) {
	//			$(target).show();
	//			$(target).prev("input").prev().remove();
	//			$(target).prev("input").remove();
			}
			else {
	//			$(target).before('<span class="input-group-btn generated"><button type="button" class="btn"><i class="glyphicon glyphicon-remove"></i></button></span><input class="form-control generated" type="text" value="'+$(json.keyTarget).val()+'" readonly />');
	//			$(target).hide();
				
				//초기화 설정
	//			$(target).parent().find("button:has(i.glyphicon-remove)").bind("click", function() {
	//				//$(target).show();
	//				//$(this).remove();
	//				$(json.keyTarget).val("");
	//				$(json.keyTarget).trigger('change');
	//			});
			}
		});
		
		$(target).fileupload({
			forceIframeTransport: true,
	        dataType: 'json',
	        done: function (e, data) {
	        	debugger;
	        	if(data.result["COMMON_HEAD"]) {
	        		if(data.result["COMMON_HEAD"]["ERROR"]) {
	        			alert(data.result["COMMON_HEAD"]["MESSAGE"]);
	        			gbox.ui.destroyProgressBar();
	        			return;
	        		}
	        	}
	        	
	        	$.getJSON("/upload?cmd=save", function(data) {
	        		console.log(data);
//	        		if(jex.isError(data)) {
//	        			alert(data["COMMON_HEAD"]["MESSAGE"]);
//	        			gbox.ui.destroyProgressBar();
//	        			return;
//	        		}
	        		
	        		if(json.onAfterUpload) {
	        			json.onAfterUpload(data[0]);
	        		}
	        		else {
		        		if(json.keyTarget) {
		        			//console.log($(json.keyTarget).val(data[0].uid));
			        		$(json.keyTarget).attr("data-changed", "Y");
			        		$(json.keyTarget).trigger('change');
		        		}
		        		
	//	        		$(target).prev("input").remove();
	//	        		$(target).before('<input class="form-control generated" type="text" value="'+data[0].fileName+'" readonly />');
	        		}
	        		
		        	$.getJSON("/upload?cmd=clear", function(data) {
		        	});
		        	
		        	gbox.ui.destroyProgressBar();
	        	});
	        },
	        progressall: function (e, data) {
	//        	var progress = parseInt(data.loaded / data.total * 100, 10);
	//            $('#progress .progress-bar').css(
	//                'width',
	//                progress + '%'
	//            );
	        },
	        beforeSend: function (event, files, index, xhr, handler, callBack) {
	        	gbox.ui.createProgressBar();
	        },
	        fail: function(){
	            jex.error("서버와 통신 중 문제가 발생했습니다.");
	        }
	        /*
	        dropZone: $('#dropzone')
	        */
	    }).bind('fileuploadsubmit', function (e, data) {
	        // The example input, doesn't have to be part of the upload form:
	        //var uploader = $('#uploader');
	        //data.formData = {uploader: uploader.val()};        
	    });
			
		//span 제거
		$(target).prev("span").remove();
	};
	
	
	//gbox.ui.setFileUpload = function(target, json) {
	//
	//		$(target).nextAll("a.btn-search").click(function() {
	//			var input = {};
	//			input["ORG_NO"] = "ORG_NO";
	//			
	//			gbox.popup.photoupload(input, function(dat) {
	//				$(json.keyTarget).val(dat.ORG_NO);
	//				$(target).val(dat.FileName);
	//				$(json.keyTarget).trigger('change');
	//			});
	//		});
	//};
	
	
	gbox.ui.createProgressBar = function(json) {
		$("#progressbar").remove();
		$("body").append("<div id=\"progressbar\" style=\"display: none;\"><div class=\"progress-label\"></div></div>");
		
//		$("#progressbar").progressbar({
//			value: false,
//			change: function() {
//				$(".progress-label", "#progressbar").text( $("#progressbar").progressbar( "value" ) + "%" );
//		    },
//		    complete: function() {
//		    	$(".progress-label", "#progressbar").text("Complete!");
//	//	    	$(".progress-label", "#progressbar").text("100%");
//		    },
//		    create: function(event, ui) {
//		    	$(".progress-label", "#progressbar").text("");
//		    	
//		    	$.blockUI({
//					message: $("#progressbar")
//				});
//		    }
//	    });

//		$.blockUI({
//			message: $("#progressbar")
//		});
		
		if(!json) json = {};
//		if(!json.interval) json.interval = 500;
		
		/*
		var timer = function() {
			gbox.session.load(function(dat) {
				var percent = parseInt(jex.null2Str(dat["PROGRESSBAR_PERCENT"], "0"), 10);
				
				if(percent > 0 && percent < 100) {
					$("#progressbar").progressbar( "option", {
						value: percent
			        });
				}
	//				else {
	//					$(target).progressbar( "option", {
	//						value: 0
	//			        });
	//				}
			});
		};
		
		gbox.ui.progressBarTimer = setInterval(timer, json.interval);
		 */
	};
	
	gbox.ui.destroyProgressBar = function() {
		//clearInterval(gbox.ui.progressBarTimer);
//		$("#progressbar").progressbar("destroy");
//		$.unblockUI();
		$("#progressbar").remove();
	};
	
	gbox.ui.setProgressBar = function(json) {
		$("#progressbar").progressbar( "option", json);
	};
	
	gbox.ui.validationEngineOptions = {
		binded: false,
		showOneMessage: true,
		promptPosition: "topLeft",
		autoHidePrompt: true,
		autoHideDelay: 1000
	};
	
	/// date
	gbox.ui.setDateRangePicker = function(target, json) {
		
		var $rangeStart = $(target).find(".range-start");
		var $rangeEnd = $(target).find(".range-end");
		
		$(target).find("a").click(function() {
			$(this).prev().focus();
		});
		
		$(json.keyTarget).bind("change", function() {
			if(jex.isNull($(this).val())) {
	//			$(target).prev("span").remove();
			}
			else {
	//			$(target).before('<span class="input-group-btn"><button type="button" class="btn"><i class="glyphicon glyphicon-remove"></i></button></span>');
				
				//초기화 설정
	//			$(target).parent().find("button:has(i.glyphicon-remove)").bind("click", function() {
	//				$(target).val("");
	//				$(json.keyTarget).val("");
	//				$(json.keyTarget).trigger('change');
	//			});
			}
		});
		
	//	$(target).attr("readonly", true);
		
		if(json.timePicker == true) {
			
			$rangeStart.datetimepicker({
				onClose: function( selectedDate ) {
	//				$rangeEnd.datepicker( "option", "minDate", selectedDate );
				},
				onSelect: function (dateText, inst) {
					var rangeStartText = dateText;
					var rangeEndText = $rangeEnd.val();
					
					if(jex.isNull(rangeEndText)) rangeEndText = "9999-12-31 23:59:59";
					
					$(json.keyTarget).val(moment(rangeStartText, "YYYY-MM-DD HH:mm").format("YYYYMMDDHHmm") + "00," + moment(rangeEndText, "YYYY-MM-DD HH:mm").format("YYYYMMDDHHmm") + "59");
				},
				timeFormat: 'HH:mm',
				numberOfMonths: 3
			});
	
			$rangeEnd.datetimepicker({
				onClose: function( selectedDate ) {
	//				$rangeStart.datepicker( "option", "maxDate", selectedDate );
				},
				onSelect: function (dateText, inst) {
					var rangeStartText = $rangeStart.val();
					var rangeEndText = dateText;
					
					if(jex.isNull(rangeStartText)) rangeStartText = "1970-01-01 00:00:00";
					
					$(json.keyTarget).val(moment(rangeStartText, "YYYY-MM-DD HH:mm").format("YYYYMMDDHHmm") + "00," + moment(rangeEndText, "YYYY-MM-DD HH:mm").format("YYYYMMDDHHmm") + "59");
				},
				timeFormat: 'HH:mm',
				numberOfMonths: 3
			});
			
			var startDate;
			var endDate;
			
			if(json.startDate) startDate = json.startDate;
			if(json.endDate) endDate = json.endDate;
			
			if(startDate) {
				$rangeStart.val(startDate.format("YYYY-MM-DD HH:mm"));
			}
			
			if(endDate) {
				$rangeEnd.val(endDate.format("YYYY-MM-DD HH:mm"));
			}
			
			if(startDate && endDate) {
				$(json.keyTarget).val(moment($rangeStart.val(), "YYYY-MM-DD HH:mm").format("YYYYMMDDHHmm") + "00," + moment($rangeEnd.val(), "YYYY-MM-DD HH:mm").format("YYYYMMDDHHmm") + "59");
			}
			
			$rangeStart.mask("9999-99-99 99:99");
			$rangeEnd.mask("9999-99-99 99:99");
			
	//		$rangeStart.datepicker( "option", "maxDate", new Date() );
	//		$rangeEnd.datepicker( "option", "maxDate", new Date() );
		}
		else {
			
			$rangeStart.datepicker({
				onClose: function( selectedDate ) {
					$rangeEnd.datepicker( "option", "minDate", selectedDate );
				},
				onSelect: function (dateText, inst) {
					var rangeStartText = dateText;
					var rangeEndText = $rangeEnd.val();
					
					if(jex.isNull(rangeEndText)) rangeEndText = "9999-12-31";
					
					$(json.keyTarget).val(moment(rangeStartText, "YYYY-MM-DD").format("YYYYMMDD") + "," + moment(rangeEndText, "YYYY-MM-DD").format("YYYYMMDD"));
				},
				numberOfMonths: 3
			});
	
			$rangeEnd.datepicker({
				onClose: function( selectedDate ) {
					$rangeStart.datepicker( "option", "maxDate", selectedDate );
				},
				onSelect: function (dateText, inst) {
					var rangeStartText = $rangeStart.val();
					var rangeEndText = dateText;
					
					if(jex.isNull(rangeStartText)) rangeStartText = "1970-01-01";
					
					$(json.keyTarget).val(moment(rangeStartText, "YYYY-MM-DD").format("YYYYMMDD") + "," + moment(rangeEndText, "YYYY-MM-DD").format("YYYYMMDD"));
				},
				numberOfMonths: 3
			});
			
			var startDate = moment();
			var endDate = moment();
			
			if(json.startDate) startDate = json.startDate;
			if(json.endDate) endDate = json.endDate;
			
			$rangeStart.val(startDate.format("YYYY-MM-DD"));
			$rangeEnd.val(endDate.format("YYYY-MM-DD"));
			$rangeStart.mask("9999-99-99");
			$rangeEnd.mask("9999-99-99");
			$(json.keyTarget).val(moment($rangeStart.val(), "YYYY-MM-DD").format("YYYYMMDD") + "," + moment($rangeEnd.val(), "YYYY-MM-DD").format("YYYYMMDD"));
			
			$rangeStart.datepicker( "option", "maxDate", moment().format("YYYY-MM-DD") );
			$rangeEnd.datepicker( "option", "maxDate", moment().format("YYYY-MM-DD") );
	
		}
	};
	/// end date
	
	gbox.ui.setUiComponent = function(target, json) {
		
		if(!json) json = {};
		
		if(json.component == "select") {
			var _target = $(target);
			var _select = _target.find("select");
			var _selected = _target.find("a:first > span");
			
			_target.find("[data-generated='li']").remove();
			
			//fill option html
			var optionHtml = "";
			
			$.each(_target.find("select > option"), function(i, v) {
				optionHtml += "<li data-generated=\"li\"><a href=\"javascript:\" data-url_link = \""+$(this).data("url_link")+"\" data-value=\""+$(this).val()+"\" data-index=\""+i+"\">"+$(this).text()+"</a></li>";
			});
			
			_selected.text(_select.find("option:selected").text());
//			else {
//				if(i == 0) {
//					_selected.text($(this).text());
//				}
//			}
			
			var _thisUl = _target.find("ul");
			
			_thisUl.append(optionHtml);
			
			//이미 초기화된 컴포넌트이면
			if(_target.attr("data-generated") == "component") {
			}
			else {
				_target.attr("data-generated", "component");
				
				//toggle select ui
				_target.find("a.field_style:first").click(function() {
					$(this).focus();
					_thisUl.toggle();
					
				});
				
				
				/*
				_target.find("a.field_style:first").blur(function() {
					
					
				//	_thisUl.toggle();
					
					
					_thisUl.slideUp();
					//alert(1);
					
				});
				*/
				
				//blur comboBox
//			_target.find("a.field_style:first").blur(function() {
//				_thisUl.hide();
//				
//			});
//	
//	
//			_this.find("*").blur(function() {
//			});
//			
//			$("body").focus(function() {
//				_thisUl.slideUp("fast");
//			});
//								
				//select event
				_target.find("ul > li[data-generated]").click(function() {
					_target.find("select > option:eq("+$(this).find("a").data("index")+")").prop("selected", true);
					_selected.text($(this).text());
					_select.trigger("change");
					$(this).focus();
					_thisUl.toggle();
				});	
				
	//			if(json.defaultValue) {
	//				_target.find("li > a[data-value='"+json.defaultValue+"']").trigger("click");
					
	//			}
			}
			
		}
	};
	
	
	gbox.ui.initPhotoNavigation = function(target) {
		var imageCount = $(target).find(".thumb_row ul li").length;
		var imageBoxWidth = 100;
		var spaceWidth = 5;
		var width = 0;

		if(imageCount > 0) {
			width = ((imageBoxWidth + spaceWidth) * imageCount) - 5;
			$(target).find("#prev, #next").show();
		}
		else {
			$(target).find("#prev, #next").hide();
		}
		
		$(target).find(".thumb_row ul").css("width", width);
		
		var containerWidth = $(target).find(".thumb_row").width();
		var contentWidth = $(target).find(".thumb_row ul").width();
		
		// contentWidth가 containerWidth보다 커지면
		var contentLeft = parseInt($(target).find(".thumb_row ul").css("left").replace(/px/, ""), 10);
		var contentRight = contentLeft + contentWidth;
		
		//왼쪽으로 이동할 이미지가 있으면
		if(contentLeft < 0) {
			//왼쪽으로 이동 버튼으로 활성화
			$(target).find("#prev img").attr("src","../img/btn/btn_prev_thum_on.png");
			
			if(!gbox.ui.photoNavidationPrevBinded) {
				$(target).find("#prev").bind("click", function() {
					gbox.ui.moveToLeftPhotoNavigation(target);
				});
				
				gbox.ui.photoNavidationPrevBinded = true;
			}
		}
		else {
			$(target).find("#prev img").attr("src","../img/btn/btn_prev_thum.png");
			
			if(gbox.ui.photoNavidationPrevBinded) {
				$(target).find("#prev").unbind("click");
				gbox.ui.photoNavidationPrevBinded = false;
			}
		}
		
		//오늘쪽으로 이동할 이미지가 있으면
		if(contentRight > containerWidth) {
			$(target).find("#next img").attr("src","../img/btn/btn_next_thum_on.png");
			
			if(!gbox.ui.photoNavigationNextBinded) {
				$(target).find("#next").bind("click", function() {
					gbox.ui.moveToRightPhotoNavidation(target);
				});
				gbox.ui.photoNavigationNextBinded = true;
			}
		}
		else {
			$(target).find("#next img").attr("src","../img/btn/btn_next_thum.png");
			
			if(gbox.ui.photoNavigationNextBinded) {
				$(target).find("#next").unbind("click");
				gbox.ui.photoNavigationNextBinded = false;
			}
		}
	};

	gbox.ui.moveToLeftPhotoNavigation = function(target) {
		var containerWidth = $(target).find(".thumb_row").width();
		var contentWidth = $(target).find(".thumb_row ul").width();
		var contentLeft = parseInt($(".thumb_row ul").css("left").replace(/px/, ""), 10);
		var contentRight = contentLeft + contentWidth;

		//왼쪽으로 움직일수 있는 픽셀 = 0 - contentLeft
		var distance = 0 - contentLeft;
		
		if(distance > 0) {
			//거리가 50px보다 크면
			if(distance >= 50) {
				//50px 이동
				$(target).find(".thumb_row ul").css("left", contentLeft + 50);
			}
			else {
				$(target).find(".thumb_row ul").css("left", 0);
			}
		}
		
		gbox.ui.initPhotoNavigation(target);
	};

	gbox.ui.moveToRightPhotoNavidation = function(target) {
		var containerWidth = $(target).find(".thumb_row").width();
		var contentWidth = $(target).find(".thumb_row ul").width();
		var contentLeft = parseInt($(".thumb_row ul").css("left").replace(/px/, ""), 10);
		var contentRight = contentLeft + contentWidth;
		
		//오른쪽으로 움직일수 있는 픽셀 = contentRight - containerWidth
		var distance = contentRight - containerWidth;
		
		if(distance > 0) {
			//거리가 50px보다 크면
			if(distance >= 50) {
				//50px 이동
				$(target).find(".thumb_row ul").css("left", contentLeft - 50);
			}
			else {
				//containerWidth - contentWidth 이동
				$(target).find(".thumb_row ul").css("left", containerWidth - contentWidth);
			}
		}
		
		gbox.ui.initPhotoNavigation(target);
	};
};