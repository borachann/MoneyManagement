 
	$(document).ready(function(){
	//	$("#loginform").trigger('reset');
//$("#passwd").attr('placeholder','1');
	$('#loginform').submit(function(e){
		e.preventDefault();

		var data = $(this).serialize();

		$.post("php/index.php", data , function(data){

			console.log('respone data : ', data);

			if(data.url){
				location.href=data.url;
			}
			else{
				$("#passwd").addClass('input_red');
				$("#userEmail").addClass('input_red');
				$("#passwd").select();
				alert("ការបញ្ចូាូលព៌តមានមិនត្រឹមត្រូវ");
			}
		});
	});

});











 