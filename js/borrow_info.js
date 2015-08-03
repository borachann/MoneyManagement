var show_page={};
var pid;
var hisid;

$(document).ready(function() {
setCalendar();
showdata();
$("ul li#borrow_info").addClass('active');
//====================================================== btndownload ==========================================
$(document).on('click','#btnprint', function(){
         $("#TBL_CONTENTS").table2excel({
           // exclude: ".noExl",
            name: "Excel Document Name"
        }); 
    });
//====================================================== btnlogout ============================================
$('#btnlogout').click(function(){
	location.href = 'php/index.php?logout=true';
});
//====================================================== search name keypress =================================
$(document).on('keyup','#searchname', function() {
	showdata();
});
		// ============================================= btnsave ==============================================
		$('#btnsave').click(function(){
			$('#frmBorrow').submit();		
			clear();	
			showdata();
		});
		$(document).on('submit','#frmBorrow',function(e){
			e.preventDefault();
			var url = $(this).attr('action');
			var dat = $(this).serialize();
			$.post(url, dat, function(data){
				if(data)
					alert("ទិន្នន័យបានរក្សាទុកដោយជោគជ័យ");
				else
					alert("ទិន្នន័យរក្សាទុកមិនបានជោគជ័យ");
			});
		});
	//==================================================== calculate money and day ===============================
	$(document).on('blur','#bamount ,#brate', function(){
		if(($("#bamount").val() == '') || ($("#brate").val() == '')){
			$("#totalAmount").val('');
			$("#totalday").val('');
			$("#perday").val('');
		}
		else{
			total = numberWithCommas(parseInt($("#bamount").val().replace(/,/g, "")) + parseInt($("#brate").val().replace(/,/g, "")));
			$("#totalAmount").val(total);		
			calculateDay($("#REGS_DATE_S").datepicker("getDate"),$("#REGS_DATE_E").datepicker("getDate"));
			moneyPerDay($("#totalAmount").val(), $("#totalday").val());	
		}	
	});
	//==================================================== set Date ======================================
	$("#btnREGS_DATE_S").click(function(){	
			$( "#REGS_DATE_S" ).datepicker("show");			
		});		
	$("#btnREGS_DATE_E").click(function(){
			$( "#REGS_DATE_E" ).datepicker("show");			
		});

	//==================================================== uncheck group =================================
		$("input:checkbox").on("change", function(){ 		 
				
			if($(":checkbox:checked").length==0){				 
				$("#all").prop('checked','checked');
				showdata();
				return;
			}
			var checkbox = $(":checkbox[name=TX_CD]");
			if ($(this).prop('checked')) {
				if ($(this).val() == "") {
					checkbox.slice(1,3).each(function() {
						$(this).attr("checked",false);
					});
				} else {
					checkbox.eq(0).attr("checked",false);					
				}
			}
			showdata();
		});
	// ============================================ btnkeyup search name ==============================================		 
		 	 $(document).on('keyup','#bname',function(){
		 	 console.log($("#bname").val());
		 	 	if($(this).val() == '')
					return;
				var str=[];
				$.post("php/borrow_info_script.php", {
					SearchName : {
						cust_name : $("#bname").val()
					}
				}, function(data){
					for(i=0; i<data.length; i++)
						{							
						str[i]= 
						         {
						         	"label": data[i].cust_name,
									"dataid": data[i].cust_id,
									"datasex": data[i].cust_sex,
									"dataimg": data[i].cust_photo
						         };
						}
				});						
				$("#bname").autocomplete({
				select: function (event, ui) {
			        $("#bname").val(ui.item.label); // display the selected text
			        $("#bsex").val(ui.item.datasex);
			        $("#custId").val(ui.item.dataid);
			        $("#PHOTO_IMG").attr('src',ui.item.dataimg);
			        $("#bamount").attr('disabled',false);
			        $('#brate').attr('disabled', false);
			        $("#btnsave").attr("disabled", false);	
			        $("#perday").removeAttr("readonly");
				    $("#totalday").removeAttr("readonly");
				    $("#totalAmount").removeAttr("readonly");	     		        
			    },
			    	maxShowItems: 8,
			    	source: str
			    });	 
			});
	//================================================== amount validation keypress ===================================
	$(document).on('keypress','#brate ,#bamount', function(e){ 

		if((e.keyCode == 9) || (e.keyCode == 8) || (e.keyCode == 46) || ((e.keyCode >=37) && (e.keyCode <= 40)))
			return ;
	var data = String.fromCharCode(e.which);	
			var reg = new RegExp('^[0-9]+$');
    	    if(!reg.test(data)){
    	    	e.preventDefault();
			}
	
	     });	 	 
	$(document).on('keyup','#brate ,#bamount', function(e){
		$(this).val(numberWithCommas($(this).val().replace(/,/g, "")));
	});
	// ============================================= btncancle ============================================
	$(document).on('click','#btncancel', function(){			
			clear();
		});
});
//================================ clear ====================================
	function clear(){
		$("form")[0].reset();
		$("#PHOTO_IMG").attr("src","img/profile.png");
		$("#bamount").attr("disabled", true);
		$("#brate").attr("disabled", true);
		$("#btnsave").attr("disabled", true);
		/*$("#perday").val("");
    	$("#totalday").val("");
   	$("#totalamount").val("");*/
    $("#perday").attr("readonly","readonly");
    $("#totalday").attr("readonly","readonly");
    $("#totalAmount").attr("readonly","readonly");
		setCalendar();
		}
//=================================================== formatter number ==============================================
function numberWithCommas(n) {
	   	return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
	}
//=================================================== set calendar ==================================================		 
 function setCalendar(){		
		$("#REGS_DATE_S").datepicker({
		      defaultDate: new Date(),
		      setDate: new Date(),
		      changeMonth: true,
		      numberOfMonths: 1,
		      dateFormat: "yy-mm-dd",
		      onClose: function( selectedDate ) {			    	  
			    	    calculateDay($("#REGS_DATE_S").datepicker("getDate"),$("#REGS_DATE_E").datepicker("getDate"));
						moneyPerDay($("#totalAmount").val(), $("#totalday").val());
						$("#REGS_DATE_E").datepicker("option", "minDate", selectedDate);
			      }
		});
		$("#REGS_DATE_E").datepicker({
		     defaultDate: new Date(),
		      setDate: new Date(),
		      changeMonth: true,
		      numberOfMonths: 1,
		      dateFormat: "yy-mm-dd",
		      onClose: function( selectedDate ) {

			    	  $("#REGS_DATE_S").datepicker("option", "maxDate", selectedDate);
			    	    calculateDay($("#REGS_DATE_S").datepicker("getDate"),$("#REGS_DATE_E").datepicker("getDate"));
						moneyPerDay($("#totalAmount").val(), $("#totalday").val());
			      }
		});		
		$("#REGS_DATE_S").datepicker('setDate', moment().format('YYYY-MM-DD'));
		$("#REGS_DATE_E").datepicker('setDate', moment().add(30, 'days').format('YYYY-MM-DD'));
}
	//================================= Calcuate Day ========================================
function calculateDay(start, end){		
        var days = (end - start) / (1000 * 60 * 60 * 24);
        $("#totalday").val(days);
        return;
}
	//================================= Calculate Money =====================================
function moneyPerDay(totalamount, totalday){
	var perday = (parseInt(totalamount.replace(/,/g, "")))/(parseInt(totalday));
		perday = perday.toString();
		if(perday.lastIndexOf(".") != -1){
                            if((perday.substring(perday.lastIndexOf("."), perday.length)).length > 4){
                                perday = perday.substring(0, perday.indexOf('.') + 4);
                                $('#perday').val(numberWithCommas(perday));
                            }
                        }
        return;
}
function showdata(){
var status;
	if($('#all').prop('checked') || ($('#con').prop('checked') && $('#fin').prop('checked'))) {
		status='';
	}
	else if($('#con').prop('checked')){
		status = 1;
	}
	else
		status = 0;

	$.post('php/borrow_info_script.php', {
		ShowData : {
			txtname : $("#searchname").val(),
			txtstatus : status
		}
	}, function(data){
		if(data.length !=0)        
	    { 
	    	for(i=0; i<data.length; i++)
	    	{
	    		perday = data[i].perday.toString();
	    		if(perday.lastIndexOf(".") != -1){
                            if((perday.substring(perday.lastIndexOf("."), perday.length)).length > 4){
                                perday = perday.substring(0, perday.indexOf('.') + 4); 
                            }
                }
	    		data[i].lend_amount = numberWithCommas(data[i].lend_amount);
	    		data[i].lend_rate = numberWithCommas(data[i].lend_rate);
	    		data[i].perday = numberWithCommas(perday);
	    		data[i].total = numberWithCommas(data[i].total);
	    	}
	    	if (jex.isNull(show_page.tbl)) {
				show_page.tbl = jex.plugin.newInstance("JEX_TBL","#TBL_CONTENTS");
			}		
    		show_page.tbl.setPaging("div:#page;per:" + 10);  
    		show_page.tbl.setAll(data);
	    }else{
            if (jex.isNull(show_page.tbl)) {
                show_page.tbl = jex.plugin.newInstance("JEX_TBL","#TBL_CONTENTS");
            }
            $("#TBL_CONTENTS tbody").html("<tr><td colspan='10' style='text-align:center;'><div> No Data</div> </td></tr>");
        }
	});
}
		 