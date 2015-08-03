<?php

$hostname = "mysql:host=127.0.0.1;";
$datanase = "dbname=user";
$username = "root";
$password = "";
$result = [];
$obj = [];

//========================================== Connection =============================================
try{
	$con = new PDO( $hostname.$datanase , $username, $password);
	$con->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
	$con->exec("SET NAMES 'utf8';");
}catch(PDOException $ex){
	die('Error : ' . '</br>' . $ex->getMessage());
}
//========================================== Return Result ==========================================
function responeJson($obj){
	header('Content-Type: application/json');
	echo json_encode($obj);
}
//=========================================== Detail User ===========================================
if(isset($_POST['DetailUser'])){
	$dat = $_POST['DetailUser'];
	$sql = "SELECT (@row_number:=@row_number + 1) AS rownum, cust_id, cust_name, cust_sex, cust_phone, cust_address, cust_photo, cust_id_card, cust_start_date FROM bo_customer,(SELECT @row_number:=0) AS t where user_id =?";
	$query = $con->prepare($sql);
	$query->execute(array($dat['userId']));
	$result = $query->fetchAll(PDO::FETCH_ASSOC);
	return responeJson($result);
}

//====================================================================================================
if(isset($_POST['ShowData'])){	
	//$sql = "SELECT * FROM bo_user";
	//$sql = "SELECT row_number() over (ORDER BY user_id desc) as rownum from bo_user";
	$sql = "SELECT (@row_number:=@row_number + 1) AS rownum, user_id, user_name, user_sex, user_phone, user_address, user_passwd, user_photo, user_id_card, user_start_date FROM bo_user,(SELECT @row_number:=0) AS t";
	$query = $con->prepare($sql);
	$query->execute();
	$result = $query->fetchAll(PDO::FETCH_ASSOC);
	return responeJson($result);
}

if(isset($_POST['Duplicate'])){	
	$dat = $_POST['Duplicate'];
	$sql = "SELECT * FROM bo_user where user_name = ?";
	$query = $con->prepare($sql);
	$query->execute(array($dat['txtname']));
	$result = $query->fetchAll(PDO::FETCH_ASSOC);
	return responeJson($result);
}

if(isset($_POST['SearchId'])){	
	$dat = $_POST['SearchId'];
	$sql = "SELECT * FROM bo_user where user_id = ?";
	$query = $con->prepare($sql);
	$query->execute(array($dat['userid']));
	$result = $query->fetchAll(PDO::FETCH_ASSOC);
	return responeJson($result);
}

if(isset($_POST['SearchName'])){	
	$dat = $_POST['SearchName'];
	$sql = "SELECT (@row_number:=@row_number + 1) AS rownum, user_id, user_name, user_sex, user_phone, user_address, user_passwd, user_photo, user_id_card, user_start_date FROM bo_user,(SELECT @row_number:=0) AS t where user_name like ?";
	$query = $con->prepare($sql);
	$query->execute(array(
		'%' . $dat['txtname'] . '%'
	));
	$result = $query->fetchAll(PDO::FETCH_ASSOC);
	return responeJson($result);
}

if(isset($_POST['insertData'])){
	$dat = $_POST['insertData'];
		$sql = "INSERT INTO bo_user (user_name, user_sex, user_phone, user_address, user_passwd, user_photo, user_id_card, user_start_date) VALUES (?,?,?,?,?,?,?,now())";
		$query = $con->prepare($sql);
		$row = $query->execute(array($dat['txtname'], $dat['txtsex'], $dat['txtphone'], $dat['txtaddress'], $dat['txtpasswd'], $dat['txtphoto'], $dat['txtidcard']));
		$obj['info'] = 'success';	
	return	responeJson($obj);	
}

if(isset($_POST['updateData'])){
	$dat = $_POST['updateData'];
		$sql = "UPDATE bo_user SET user_sex=?,user_phone=?,user_address=?,user_passwd=?,user_photo=?,user_id_card=? WHERE user_id=?";
		$query = $con->prepare($sql);
		$row = $query->execute(array($dat['txtsex'], $dat['txtphone'], $dat['txtaddress'], $dat['txtpasswd'], $dat['txtphoto'], $dat['txtidcard'], $dat['txtid']));
		$obj['info'] = 'success';	
	return	responeJson($obj);	
}

responeJson($_REQUEST);

?>