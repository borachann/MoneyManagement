<?php
// $hostname = "mysql:host=127.0.0.1;";
// $datanase = "dbname=user";
// $username = "root";
// $password = "";
// // $result = [];
// $obj = [];

// function responeJson($obj){
// 	header('Content-Type: application/json');
// 	echo json_encode($obj);
// }


// try{
// 	$con = new PDO( $hostname.$datanase , $username, $password);
// 	$con->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
// 	$con->exec("SET NAMES 'utf8';");
// }catch(PDOException $ex){
// 	die('Error : ' . '</br>' . $ex->getMessage());
// }



// if(isset($_POST['ShowData'])){	
// 	$sql = "SELECT * FROM bo_user";
// 	$query = $con->prepare($sql);
// 	$query->execute();
// 	$result = $query->fetchAll(PDO::FETCH_ASSOC);
// 	return responeJson($result);
// }

// if(isset($_POST['insertData'])){
// 	$dat = $_POST['insertData'];
// 		$sql = "INSERT INTO bo_user (user_name, user_sex, user_phone, user_address, user_passwd, user_photo, user_id_card) VALUES (?,?,?,?,?,?,?)";
// 		$query = $con->prepare($sql);
// 		$row = $query->execute(array($dat['txtname'], $dat['txtsex'], $dat['txtphone'], $dat['txtaddress'], $dat['txtpasswd'], $dat['txtphoto'], $dat['txtidcard']));
// 		$obj['info'] = 'success';	
// 		responeJson($obj);	
// } else {
// 	$obj['info'] = 'failure';
// 	responeJson($obj);	
// }

class MoneyMgr {
	private $con;
	private $results = [];
	private $text = "";

	public function __construct(){
		$this->con = new DB();
	}

	public function insertData($params){
		try {
			$this->con->prepare(
				"INSERT INTO bo_user (user_name, user_sex, user_phone, user_address, user_passwd, user_photo, user_id_card) VALUES (?,?,?,?,?,?,?)",
				$params
			);
		} catch (Exception $e){
			echo "Function InsertData erorr : " . $e->getMessage();
		}
	}

	public function queryData(){
		try {
			return $query = $this->con->query("SELECT * FROM bo_user");
		} catch (Exception $e){
			echo "Function QueryData erorr : ";
		}
	}


}

class DB {
	private $hostname = "mysql:host=127.0.0.1;";
	private $datanase = "dbname=user";
	private $username = "root";
	private $password = "";


	private $con;

	public function __construct(){
		try{
			$this->con = new PDO( $this->hostname . $this->datanase , $this->username, $this->password);
			$this->con->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
			$this->con->exec("SET NAMES 'utf8';");
			echo 'connection';
		}catch(PDOException $ex) {
			die('Connection Error : ' . '</br>' . $ex->getMessage());
		}
	}

	public function query($sql, $params = []){
		$query = $this->con->prepare($sql);
		$query->execute($params);
		return $query->fetchAll(PDO::FETCH_ASSOC);
	}

	public function prepare($sql, $params = []){
		$query = $this->con->prepare($sql);
		$query->execute($params);
	}

	public function __deconstruct(){
		$this->con = null;
	}
}

class Respond {
	public static function json($obj){
		header('Content-Type: application/json');
		echo json_encode($obj);
	}
}

echo "<pre>";
// $money = new MoneyMgr();
$conn = new DB();

$conn->prepare(
	"INSERT INTO bo_user (user_name, user_sex, user_phone, user_address, user_passwd, user_photo, user_id_card) VALUES (?,?,?,?,?,?,?)",
	array('hello1', 'male', '0964577770', 'PP', '123456', 'No image', '7777')
);

$q = $conn->query("SELECT * FROM bo_user");
print_r($q);

// try {
// 	
// 	$data = $money->queryData();
// 	print_r($data);

// 	$money->insertData(array(
// 		'hello1', 'male', '0964577770', 'PP', '123456', 'No image', '7777'
// 	));

// 	// Respond::json($data);

// } catch (Exception $e){
// 	echo '<br/>' . $e->getMessage();
// }


// $money->insertData(array($dat['txtname'], $dat['txtsex'], $dat['txtphone'], $dat['txtaddress'], $dat['txtpasswd'], $dat['txtphoto'], $dat['txtidcard']));


?>