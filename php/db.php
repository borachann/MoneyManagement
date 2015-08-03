<?php
	require_once 'config.php';

	try{
		$con = new PDO('mysql:host=' . DB_HOST . ';dbname=' . DB_NAME, DB_USER, DB_PASS);
		$con->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
		$con->exec("SET NAMES 'utf8';");
	}catch(PDOException $ex){
		die('Error : ' . '</br>' . $ex->getMessage());
	}

?>