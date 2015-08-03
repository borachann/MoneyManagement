<?php

require 'FileUpload.php';

function responeJson($obj){
	header('Content-Type: application/json');
	echo json_encode($obj);
}

$path = 'img/users/';

$fileuploader = new FileUpload('../' . $path);
$fileuploader->image('fileUpload');
// print_r($fileuploader->getInfo());
// print_r($fileuploader->getMessage());

$result = array(
	'fileInfo' => $fileuploader->getInfo(),
	'errorMessage' => $fileuploader->getMessage(),
	'filepath' => $path . $fileuploader->getInfo()['name']
);

return responeJson($result);


?>