<?php
$file = $_POST['filename'];

if( isset($file) ){
	if(unlink ('../' . $file)){
	echo 'delete success';
	} else {
		echo 'delete failure';
	}
}


?>