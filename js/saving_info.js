var show_page = {};
var show_spage = {};
getid = "";
var browser = '';
var dup = false;
$(document).ready(function() { 
    browser = detectBrowser();
    showdata();
    $("ul li#saving_info").addClass('active');
      //==================================================== Log out ===================================================================
    $("#btnlogout").click(function(){
        location.href = 'php/index.php?logout=true';
    });
    //==================================================== Upload Photo ==============================================================
            $('#upload').change(function(){
                $('#formUpload1').submit();
            });
 
            $('#formUpload1').submit(function(e){ 
            e.preventDefault();
            $.ajax({
                url: $(this).attr('action'),
                type: "POST",
                data: new FormData(this),
                contentType: false,
                cache: false,
                processData: false,
                success: function(data){
                    if(data.errorMessage){
                        alert(data.errorMessage);
                    } else {
                       $('#PHOTO_IMG').attr('src', data.filepath);
                    }
                }
            });
        });


    //==================================================== Search Name ===============================================================
    $(document).on('keyup','#searchname',function(e){
          $.post("http://localhost/money_management/php/saving_info.php", {
            SearchName: {
                txtname: $('#searchname').val()
            }
        }, function(data) {
                          
                        if (jex.isNull(show_page.tbl)) {
                            show_page.tbl = jex.plugin.newInstance("JEX_TBL","#TBL_CONTENTS");
                        }       
                        show_page.tbl.setPaging("div:#page;per:" + 10); 
                        console.log("DATA_",data);
                        show_page.tbl.setAll(data);                     
                if(data.length ==0)        
                    { 
                    $("#TBL_CONTENTS tbody").html("<tr><td colspan='8' style='text-align:center;'><div> No Data</div> </td></tr>");
                }
        });
    });

    //==================================================== Check validation Username =================================================
    $("#txtName").on('keypress', function(e) {
        var cust_id = $(this).val();
        var code = e.keyCode;
        if (browser == "Firefox") {
            code = e.charCode || e.keyCode;
            if ($.inArray(code, [46, 8, 9, 27, 13]) !== -1 ||
                // Allow: Ctrl+A
                (code == 65 && e.ctrlKey === true) ||
                // Allow: home, end, left, right, down, up
                (code >= 35 && code <= 40)) {
                // let it happen, don't do anything
                return;
            }
        }
        if (code == 32) {
            if ((cust_id.slice(-1) == " ") || (cust_id.length == 0)) {
                e.preventDefault();
                return;
            }
        } else if (code == 95) {
            if ((cust_id.slice(-1) == "_") || (cust_id.length == 0)) {
                e.preventDefault();
                return;
            }
        } else {
            var unicodeWord = XRegExp('(^[\\pL\\pNក-\u17fe]+[ _])*[\\pL\\pNក-\u17fe]+$');
           
            var key = String.fromCharCode(code);
            if (!unicodeWord.test(key)) {
                e.preventDefault();
            }
        }
    });
    //=========================== Check validation on phone number and id card ===================

    $(document).on('keydown', '#txtPhone ,#txtIdcard', function(e) {
        if ($.inArray(e.keyCode, [46, 8, 9, 27, 13]) !== -1 ||
            // Allow: Ctrl+A
            (e.keyCode == 65 && e.ctrlKey === true) ||
            // Allow: home, end, left, right, down, up
            (e.keyCode >= 35 && e.keyCode <= 40)) {
            // let it happen, don't do anything
            return;
        }
        if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
            e.preventDefault();
        }
    });

    // ========================== check validation on blur ====================================
    $(document).on('blur', '#txtName ,#txtSex ,#txtPhone ,#txtAddress ,#txtIdcard', function() {
        if ($(this).val() == "")
            $(this).addClass('input_red');
        else
            $(this).removeClass('input_red');
    }); 

    // ========================== btncancel ===========================================

    $(document).on('click', '#btncancel', function() {
        clearForm();
       
        $('#left').hide(400);
    });
    // ========================== btncreate ============================================

    $(document).on('click', '#btncreate', function() {
    	clearForm();
    	$("#txtName").removeAttr('readonly');
        $('#left').show(400);
        $("#btnupdate").attr('id', 'btnsave');
    });
    // ============================================ btnsave =========================================
    $(document).on('click', '#btnsave', function(e) {      

        var unicodeWord = XRegExp('(^[\\pL\\pNក-\u17fe]+[ _])*[\\pL\\pNក-\u17fe]+$');       
        var reg = new RegExp('^[0-9]+$');
        if ($("#txtName").val().length == 0) {
            $("#txtName").addClass("input_red");
            alert("សូមបញ្ចូល" + " " + $("#txtName").attr("placeholder"));
            return;
        } else {
            if ((!unicodeWord.test($.trim($('#txtName').val()))) || ($('#txtName').val().length > 30)) {
                $("#txtName").addClass("input_red");
                alert("ការបញ្ចូល" + " " + $("#txtName").attr("placeholder") + " មិនត្រឹមត្រូវ។");
                return;
            }
        }
        if (reg.test($("#txtPhone").val())) {
            $("#txtPhone").removeClass("input_red");
        } else {
            $("#txtPhone").addClass("input_red");
            alert("ការបញ្ចូល" + " " + $("#txtPhone").attr("placeholder") + " មិនត្រឹមត្រូវ។");
            return;
        }
        if ($("#txtAddress").val().length == 0) {
            $("#txtAddress").addClass("input_red");
            alert("សូមបញ្ចូល" + " " + $("#txtAddress").attr("placeholder"));
            return;
        }
        if (reg.test($("#txtIdcard").val())) {
            $("#txtIdcard").removeClass("input_red");
        } else {
            $("#txtIdcard").addClass("input_red");
            alert("ការបញ្ចូល" + " " + $("#txtIdcard").attr("placeholder") + " មិនត្រឹមត្រូវ។");
            return;
        }
        checkduplicate();

    });

	//=================================== btn update user =======================================
	$(document).on('click','#btnupdate',function(){
		var unicodeWord = XRegExp('(^[\\pL\\pNក-\u17fe]+[ _])*[\\pL\\pNក-\u17fe]+$');       
        var reg = new RegExp('^[0-9]+$');

        if (reg.test($("#txtPhone").val())) {
            $("#txtPhone").removeClass("input_red");
        } else {
            $("#txtPhone").addClass("input_red");
            alert("ការបញ្ចូល" + " " + $("#txtPhone").attr("placeholder") + " មិនត្រឹមត្រូវ។");
            return;
        }
        if ($("#txtAddress").val().length == 0) {
            $("#txtAddress").addClass("input_red");
            alert("សូមបញ្ចូល" + " " + $("#txtAddress").attr("placeholder"));
            return;
        }
        if (reg.test($("#txtIdcard").val())) {
            $("#txtIdcard").removeClass("input_red");
        } else {
            $("#txtIdcard").addClass("input_red");
            alert("ការបញ្ចូល" + " " + $("#txtIdcard").attr("placeholder") + " មិនត្រឹមត្រូវ។");
            return;
        }

			if(confirm("Do you want to update?"))
				{			
     				$.post("http://localhost/money_management/php/saving_info.php", {
		            updateData: {
		                txtsex: $("input[name='txtSex']:checked").val(),
		                txtphone: $('#txtPhone').val(),
		                txtaddress: $('#txtAddress').val(),
		                txtidcard: $('#txtIdcard').val(),
		                txtphoto: $('#PHOTO_IMG').attr('src'),
		                txtid: $('#txtId').val()
		            }
       			 }, function(data) {
		            if (data.info == "success") {
		               alert("អ្នកប្រើបា្រស់ឈ្មោះ '" + $('#txtName').val() + "' ត្រូវបានរក្សាទុក ដោយជោគជ័យ។");	
		                clearForm();
		                $('#left').hide(400);
		                showdata();				
					}			 
					$("#txtId").val();
					$("#btnupdate").attr('id','btnsave');
		            });	                
        }	  				
	});


    // ========================== tbody tr ==============================================

    $(document).on('click', '#TBL_CONTENTS tr td:not(:last-child)', function() {
        $("#txtName").attr('readonly','readonly');
        $.post("http://localhost/money_management/php/saving_info.php", {
            SearchId: {
                userid: $(this).parent().children().html()
            }
        }, function(data) {
            console.log(data);
        	$('#left').show(400);
        	$("#txtId").val(data[0].cust_id);
            $("#txtName").val(data[0].cust_name);
			$("#txtPhone").val(data[0].cust_phone);
			$("#txtAddress").val(data[0].cust_address);
			$("#txtIdcard").val(data[0].cust_id_card);
            $("#PHOTO_IMG").attr('src',data[0].cust_photo);
			if(data[0].cust_sex == "ប្រុស")
				$("input[name='txtSex'][value=ប្រុស]").prop('checked', 'checked'); 
			else
				$("input[name='txtSex'][value=ស្រី]").prop('checked', 'checked');		
		 
			$("#btnsave").attr("id","btnupdate");
        });
}); /* document ready end */

    // ================================== See Detail information =============================================

    $(document).on('click', 'tbody tr #detail', function() {

        /*var ajax=jex.createAjaxUtil("bo_detail");
			var input={};
			input["PID"]=$(this).parent().children().html();
			
			if (jex.isNull(show_spage.tbl)) {
				show_spage.tbl = jex.plugin.newInstance("JEX_TBL","#TBL_DCONTENTS");
			}
			show_spage.tbl.addEvent("onSvrPageChange", function(data) {
				input["PAGINATIONS"] = {
				       "PAGE_NO"  : data,
				    "PAGE_SZE" : show_spage.tbl.getSvrPageSize()
				  };
				//search_person();		
				}); 
			/*show_spage.tbl.addFormatter("PSTART_DATE", function(dat) {
				   return moment(dat, "YYYYMMDD").format("YYYY-MM-DD");
				  });*/
        /*show_spage.tbl.setPaging("div:#dpage;per:" + 10);
			if (jex.isNull(input["PAGINATIONS"])) {
				var hash = {};
				hash['currentPage'] = "1";
				hash['svrPage'] = "1";
				jex.setHString(hash);
				input["PAGINATIONS"] = {
					"PAGE_NO" : "1",
					"PAGE_SZE" : show_spage.tbl.getSvrPageSize()	
				};		
			}
			
			ajax.set(input);
			ajax.execute(function(data){
				 for(i=0; i<data["REC"].length; i++){
					if((moment().diff(data.REC[i].START_BORROW,'day') + 1) < 30)
						data["REC"][i].PAGE_CD  = moment().diff(data.REC[i].START_BORROW,'day') + 1;
					else
						data["REC"][i].PAGE_CD  = 30;
					if(data["REC"][i].PAGE_URL=='0')
						data.REC[i].PAGE_URL='បន្ត';
					else
						data.REC[i].PAGE_URL='បញ្ចប់';
						data["REC"][i].PAGE_SZE  = 'N/A';
						data["REC"][i].TOTAL_PAGES  = 'N/A';
				}
				show_spage.tbl.setTotalRows(data["PAGINATIONS"].TOTAL_ROWS);
				show_spage.tbl.setLastSvrPageNo(data["PAGINATIONS"].TOTAL_PAGES);
				show_spage.tbl.setAll(data["REC"]);
			console.log(data["REC"].length);
			});*/

    }); 

});

// ============================================= formatstring =====================================
function formatstr(str) {
    y = str.substr(0, 4);
    m = str.substr(4, 2);
    d = str.substr(6, 2);
    return d + '-' + m + '-' + y;
}

function detectBrowser() {
    var N = navigator.appName;
    var UA = navigator.userAgent;
    var browserVersion = UA.match(/(opera|chrome|safari|firefox|msie)\/?\s*(\.?\d+(\.\d+)*)/i);
    browserVersion = browserVersion ? [browserVersion[1]] : [N];
    return browserVersion;
};

function showdata() {
    $.post("http://localhost/money_management/php/saving_info.php", {
        ShowData: ''
    }, function(data) {
    	if(data.length !=0)        
	    {	    	
	    	if (jex.isNull(show_page.tbl)) {
				show_page.tbl = jex.plugin.newInstance("JEX_TBL","#TBL_CONTENTS");
			}		
        		show_page.tbl.setPaging("div:#page;per:" + 10); 
        		console.log("DATA_",data);
        		show_page.tbl.setAll(data);
	    }
        else{
            if (jex.isNull(show_page.tbl)) {
                show_page.tbl = jex.plugin.newInstance("JEX_TBL","#TBL_CONTENTS");
            }
            $("#TBL_CONTENTS tbody").html("<tr><td colspan='8' style='text-align:center;'><div> No Data</div> </td></tr>");
        }
    });
}
//======================================================== Check duplicate Name ==================================
function checkduplicate(){

  $.post("http://localhost/money_management/php/saving_info.php", {
            Duplicate: {
                txtname: $('#txtName').val()
            }
        }, function(data) {
            if (data.length != 0) {
                $('#txtName').addClass('input_red');
                alert("ឈ្មោះអ្នកប្រើ '" + $('#txtName').val() + "' មានរួចហើយ");
                return;
            }
           	else{
           		insertInfo();
           	}
        });
}

//========================================================= insert Data ============================================
(function($) {

    window.insertInfo = function() {
        $.post("http://localhost/money_management/php/saving_info.php", {
            insertData: {
                txtname: $('#txtName').val(),
                txtsex: $("input[name='txtSex']:checked").val(),
                txtphone: $('#txtPhone').val(),
                txtaddress: $('#txtAddress').val(),
                txtidcard: $('#txtIdcard').val(),
                txtphoto: $('#PHOTO_IMG').attr('src')
            }
        }, function(data) {
            if (data.info == "success") {
                alert("អ្នកប្រើបា្រស់ឈ្មោះ '" + $('#txtName').val() + "' ត្រូវបានរក្សាទុក ដោយជោគជ័យ។");
                $("#forminfo").trigger('reset');
                $("#forminfo input[type='text'] , input[type='password']").each(function() {
                    $(this).removeClass('input_red');
                });
                $("#PHOTO_IMG").attr("src", "img/profile.png");
                $('#left').hide(400);
                showdata();
            } else
                alert("អ្នកប្រើបា្រស់ឈ្មោះ " + $('#txtName').val() + " ត្រូវបានរក្សាទុកិនបានជោគជ័យ ។");
        });
    }

})(jQuery, window);

//============================================================ clear data ===============================
function clearForm(){
	$("#txtName").val("");
    $("#txtPasswd").val("");
    $("#txtConfirmpasswd").val("");
    $("#txtPhone").val("");
    $("#txtAddress").val("");
    $("#txtIdcard").val("");
    $("input[name='txtSex'][value=ប្រុស]").prop('checked', 'checked'); 
    $("#forminfo input[type='text'] , input[type='password']").each(function() {
    $(this).removeClass('input_red');
                });
    $("#PHOTO_IMG").attr("src", "img/profile.png");
}
