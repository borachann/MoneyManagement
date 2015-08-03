<?php

require_once 'common.php';
require_once 'db.php';

$result = [];
$obj = [];

	if(isset($_POST['username']) && isset($_POST['password']) ){
		$sql = "SELECT user_id FROM bo_user where user_name = ? and user_passwd = ?";
		$query = $con->prepare($sql);
		$query->execute(array(
			$_POST['username'], $_POST['password']
		));
			
		$login = $query->fetch(PDO::FETCH_OBJ); 
		
		if(isset($login->user_id)){
			Cls::session('usercode', $login->user_id);
			if($login->user_id == 1)
				Cls::responeJson(['url' => URL . 'user_info.php']);
			else
				Cls::responeJson(['url' => URL . 'cust_info.php']);
			// Cls::redirect('../user_info.html');
		} else {
			Cls::responeJson(['url' => '']);
		}
	}

	if(isset($_GET['logout'])){
		Cls::removeSession('usercode');
		Cls::redirect(URL . 'index.php');
		// echo '<pre>';
		// print_r($_SESSION);
	}



?>