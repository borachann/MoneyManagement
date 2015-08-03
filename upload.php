<!DOCTYPE html>
<html>
<head>
	<title>Upload</title>
	<script src="js/jquery.min.js"></script>
	<script type="text/javascript">	
	
	$(document).ready(function() {
		var filepath;

		$('#formUpload1').on('submit', (function(e){
        	e.preventDefault();
	        $.ajax({
	            url: $(this).attr('action'),
	            type: "POST",
	            data: new FormData(this),
	            contentType: false,
	            cache: false,
	            processData: false,
	            success: function(data){
	                // console.log('data : ', data);
	                if(data.errorMessage){
	                	alert(data.errorMessage);
	                } else {
	                	alert('Success');
	                	filepath = data.filepath;
	                }
	            }
	        });
	    }));

	    $('#btnDelete').click(function(){
	    	alert(filepath);
	    	$.post('php/delete.php', {'filename': filepath}, function(data){
	    		console.log('delete', data);
	    	});
	    });

	});
</script>



</head>
<body>
 
<form action="php/fileuploaded.php" id="formUpload1" method="post">
  	<input id="upload" type="file" name="fileUpload" value="upload" />	
  	<input type="hidden" id="PHOTO" data-id="PHOTO" />
	<input type="hidden" id="FILE_PATH" data-id="FILE_PATH" />
	<input id="btnUpload" type="submit" name="btnUpload" value="Upload">	
</form>

<button id="btnDelete">Delete</button>

</body>
</html>