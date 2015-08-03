<?php

require_once 'common.php';
require_once 'db.php';

$result = [];
$obj = [];

if(isset($_POST['ShowData'])){	
	//$sql = "SELECT * FROM bo_user";
	//$sql = "SELECT row_number() over (ORDER BY user_id desc) as rownum from bo_user";
	$sql = "SELECT (@row_number:=@row_number + 1) AS rownum, cust_id, cust_name, cust_sex, cust_phone, cust_address, cust_photo, cust_id_card, cust_start_date FROM bo_saving_cust,(SELECT @row_number:=0) AS t";
	$query = $con->prepare($sql);
	$query->execute();
	$result = $query->fetchAll(PDO::FETCH_ASSOC);
	return Cls::responeJson($result);
}

if(isset($_POST['Duplicate'])){	
	$dat = $_POST['Duplicate'];
	$sql = "SELECT * FROM bo_saving_cust where cust_name = ?";
	$query = $con->prepare($sql);
	$query->execute(array($dat['txtname']));
	$result = $query->fetchAll(PDO::FETCH_ASSOC);
	return Cls::responeJson($result);
}

if(isset($_POST['SearchId'])){	
	$dat = $_POST['SearchId'];
	$sql = "SELECT * FROM bo_saving_cust where cust_id = ?";
	$query = $con->prepare($sql);
	$query->execute(array($dat['userid']));
	$result = $query->fetchAll(PDO::FETCH_ASSOC);
	return Cls::responeJson($result);
}

if(isset($_POST['SearchName'])){	
	$dat = $_POST['SearchName'];
	$sql = "SELECT (@row_number:=@row_number + 1) AS rownum, cust_id, cust_name, cust_sex, cust_phone, cust_address, cust_photo, cust_id_card, cust_start_date FROM bo_saving_cust,(SELECT @row_number:=0) AS t where cust_name like ?";
	$query = $con->prepare($sql);
	$query->execute(array(
		'%' . $dat['txtname'] . '%'
	));
	$result = $query->fetchAll(PDO::FETCH_ASSOC);
	return Cls::responeJson($result);
}

if(isset($_POST['insertData'])){
	$dat = $_POST['insertData'];
		$sql = "INSERT INTO bo_saving_cust (cust_name, cust_sex, cust_phone, cust_address, cust_photo, cust_id_card, cust_start_date, cust_status) VALUES (?,?,?,?,?,?,now(),?)";
		$query = $con->prepare($sql);
		$row = $query->execute(array($dat['txtname'], $dat['txtsex'], $dat['txtphone'], $dat['txtaddress'], $dat['txtphoto'], $dat['txtidcard'],'1'));
		$obj['info'] = 'success';	
	return	Cls::responeJson($obj);	
}

if(isset($_POST['updateData'])){
	$dat = $_POST['updateData'];
		$sql = "UPDATE bo_saving_cust SET cust_sex=?,cust_phone=?,cust_address=?,cust_photo=?,cust_id_card=? WHERE cust_id=?";
		$query = $con->prepare($sql);
		$row = $query->execute(array($dat['txtsex'], $dat['txtphone'], $dat['txtaddress'], $dat['txtpasswd'], $dat['txtphoto'], $dat['txtidcard'], $dat['txtid']));
		$obj['info'] = 'success';	
	return	Cls::responeJson($obj);	
}

Cls::responeJson($_REQUEST);

?>