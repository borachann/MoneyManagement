<?php
/**
 * Created by PhpStorm.
 * User: Ravuthz
 * Date: 3/23/2015
 * Time: 10:24 PM
 */

class FileUpload {
    private $dirName, $fileName;

    /* There are private constant for file upload message */
    const E_FILE_CONTENT = "File is not an image.";
    const E_FILE_EXISTS = "Sorry, file already exists.";
    const E_FILE_SIZE = "Sorry, your file is too large.";
    const E_FILE_TYPE = "File must be bmp, jpg, jpeg, png, or gif";
    const E_UPLOAD_FAIL = "Sorry, there was an error while uploading your file.";

    private $errorMessage = "";
    private $isError = false;

//    private $imageMaxSize = 5000000; /* 5*1024*1024 or 5242880 = 5 MegaBytes */
    private $imageMaxSize = 5242880;

    public function __construct($dirName = "") {
        if ($dirName){
            $this->dirName = $dirName;
        }
    }

    public function image($fileUploadName) {
        $this->fileName = $fileUploadName;
        $fileName = $_FILES[$fileUploadName]['name'];
        $fileTemp = $_FILES[$fileUploadName]['tmp_name'];
        $fileSize = $_FILES[$fileUploadName]['size'];

        $file = $this->dirName . basename($fileName);
        $fileExt = pathinfo($file, PATHINFO_EXTENSION);

        $photos = array("bmp", "jpg", "jpeg", "png", "gif");

        /* Check if this file is already have or not */
        if (file_exists($file)) {
            $this->errorMessage = FileUpload::E_FILE_EXISTS;
            $this->isError = true;
        } else {

            /* Check if this file is a actual image or fake image */
            $check = getimagesize($fileTemp);
            if($check !== false) {
                $this->isError = false;
            } else {
                $this->errorMessage = FileUpload::E_FILE_CONTENT;
                $this->isError = true;
            }

            /* Check if this file size is in limit size or not */
            if ($fileSize > $this->imageMaxSize) {
                $this->errorMessage = FileUpload::E_FILE_SIZE;
                $this->isError = true;
            }

            /* Check if this file type is in limit type or not */
            if (!in_array(strtolower($fileExt), $photos)){
                $this->errorMessage = FileUpload::E_FILE_TYPE;
                $this->isError = true;
            }
        }

        if ($this->isError === true){
            return false;
        } else {
            if (move_uploaded_file($fileTemp, $file)){
                $this->isError = false;
                return true;
            } else {
                $this->errorMessage = FileUpload::E_UPLOAD_FAIL;
                $this->isError = true;
                return false;
            }
        }
    }

    public function getInfo(){
        return $_FILES[$this->fileName];
    }

    public function getMessage(){
        return $this->errorMessage;
    }
}

?>