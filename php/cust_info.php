<?php
require "common.php";

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
//================================================ Detail information ================================
if(Cls::post('DetailUser')){ 
	$dat = $_POST['DetailUser'];
	$sql = "SELECT
	(@row_number :=@row_number + 1) AS rownum,
	A.lend_id,
	A.cust_id,
	A.user_id,
	A.lend_start,
	A.lend_stop,
	A.lend_amount,
	(
		CASE
		WHEN (
			A.lend_status = 1) THEN
				'​បន្ត'
			ELSE
				'បញ្ចប់'
		end
		) AS lend_status,
		A.lend_rate,
		B.cust_name,
		TIMESTAMPDIFF(
			DAY,
			A.lend_start,
			A.lend_stop
		) AS during,
	(A.lend_amount + A.lend_rate) as total ,
	((A.lend_amount + A.lend_rate) / TIMESTAMPDIFF(
			DAY,
			A.lend_start,
			A.lend_stop
		)) as perday
	FROM
		bo_lending A
	INNER JOIN bo_customer B ON A.cust_id = B.cust_id,
	(SELECT @row_number := 0) AS t where A.cust_id = ?";
	$stm = $con->prepare($sql);
	$stm->execute(array($dat['custId']));
	$result = $stm->fetchAll(PDO::FETCH_OBJ);
	Cls::responeJson($result);
}
//====================================================================================================
if(isset($_POST['ShowData'])){	
	//$sql = "SELECT * FROM bo_user";
	//$sql = "SELECT row_number() over (ORDER BY user_id desc) as rownum from bo_user";
	$sql = "SELECT (@row_number:=@row_number + 1) AS rownum, cust_id, cust_name, cust_sex, cust_phone, cust_address, cust_photo, cust_id_card, cust_start_date FROM bo_customer,(SELECT @row_number:=0) AS t";
	$sql = $sql . " where user_id = " . Cls::session('usercode');
	$query = $con->prepare($sql);
	$query->execute();
	$result = $query->fetchAll(PDO::FETCH_ASSOC);
	return responeJson($result);
}

if(isset($_POST['Duplicate'])){	
	$dat = $_POST['Duplicate'];
	$sql = "SELECT * FROM bo_customer where cust_name = ?";
	$query = $con->prepare($sql);
	$query->execute(array($dat['txtname']));
	$result = $query->fetchAll(PDO::FETCH_ASSOC);
	return responeJson($result);
}

if(isset($_POST['SearchId'])){	
	$dat = $_POST['SearchId'];
	$sql = "SELECT * FROM bo_customer where cust_id = ?";
	$query = $con->prepare($sql);
	$query->execute(array($dat['userid']));
	$result = $query->fetchAll(PDO::FETCH_ASSOC);
	return responeJson($result);
}

if(isset($_POST['SearchName'])){	
	$dat = $_POST['SearchName'];
	$sql = "SELECT (@row_number:=@row_number + 1) AS rownum, cust_id, cust_name, cust_sex, cust_phone, cust_address, cust_photo, cust_id_card, cust_start_date FROM bo_customer,(SELECT @row_number:=0) AS t where cust_name like ?";
	$sql = $sql . " and user_id = " . Cls::session('usercode');
	$query = $con->prepare($sql);
	$query->execute(array(
		'%' . $dat['txtname'] . '%'
	));
	$result = $query->fetchAll(PDO::FETCH_ASSOC);
	return responeJson($result);
}

if(isset($_POST['insertData'])){
	$dat = $_POST['insertData'];
		$sql = "INSERT INTO bo_customer (cust_name, cust_sex, cust_phone, cust_address, cust_photo, cust_id_card, cust_start_date, cust_status, user_id) VALUES (?,?,?,?,?,?,now(),?,?)";
		$query = $con->prepare($sql);
		$row = $query->execute(array($dat['txtname'], $dat['txtsex'], $dat['txtphone'], $dat['txtaddress'], $dat['txtphoto'], $dat['txtidcard'],'1', Cls::session('usercode')));
		$obj['info'] = 'success';	
	return	responeJson($obj);	
}

if(isset($_POST['updateData'])){
	$dat = $_POST['updateData'];
		$sql = "UPDATE bo_customer SET cust_sex=?,cust_phone=?,cust_address=?,cust_photo=?,cust_id_card=? WHERE cust_id=?";
		$query = $con->prepare($sql);
		$row = $query->execute(array($dat['txtsex'], $dat['txtphone'], $dat['txtaddress'], $dat['txtphoto'], $dat['txtidcard'], $dat['txtid']));
		$obj['info'] = 'success';	
	return	responeJson($obj);	
}

responeJson($_REQUEST);

?>