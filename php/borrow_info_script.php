<?php
require "common.php";
require "db.php";

/* Check is session[ usercode ] is not exist redirect to index.php */
Cls::security();

/* Get the usercode sessoin */
$usercode = Cls::session('usercode');
 
if(isset($_POST["SearchName"])){
	$obj = $_POST["SearchName"];
	$key = '"%' . $obj['cust_name'] . '%"';
	$sql = "SELECT * FROM `bo_customer` where `cust_name` like $key and user_id=$usercode"; 
	$stm = $con->prepare($sql);
	$stm->execute();
	$result = $stm->fetchAll(PDO::FETCH_OBJ);
	Cls::responeJson($result);
}

if(Cls::post('bamount') && intval($_POST['bamount']) > 0){

	$bamount = str_replace(',', '', Cls::post('bamount'));
	$brate=str_replace(',', '', Cls::post('brate'));
	$sql = "insert into bo_lending (cust_id, user_id, lend_start, lend_stop, lend_amount, lend_status, lend_rate)
	value (?,?,?,?,?,?,?)";
	$stm = $con->prepare($sql);
	$result = $stm->execute(array(
		Cls::post('custId'),
		Cls::session('usercode'),
		Cls::post('startdate'),
		Cls::post('stopdate'),
		$bamount,
		1,
		$brate
	));

	Cls::responeJson($result);
}

if(Cls::post('ShowData')){
	 $dat = $_POST['ShowData'];
	 
//echo ("dddddddddddddddddddddddddddddd" . $dat['txtname']);
	//$sql= "SELECT * from bo_lending";
	$sql = "SELECT
	(@row_number :=@row_number + 1) AS rownum,
	A.lend_id,
	A.cust_id,
	A.user_id,
	A.lend_start,
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
	(A.lend_amount + A.lend_rate) as total ,
	A.perday
	FROM
		bo_lending A
	INNER JOIN bo_customer B ON A.cust_id = B.cust_id,
	(SELECT @row_number := 0) AS t where A.user_id = " . $usercode . " and B.cust_name like '%" . $dat['txtname'] . "%'";
if($dat['txtstatus'] != '')
	$sql = $sql . " and A.lend_status = " . $dat['txtstatus'];


$stm = $con->prepare($sql);
$stm->execute();
$result = $stm->fetchAll(PDO::FETCH_OBJ);
Cls::responeJson($result);
}

?>