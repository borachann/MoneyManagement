<?php

	require_once 'config.php';

	class Cls {

		public static function post($item){
			return isset($_POST[$item]) ? $_POST[$item] : null;
		}
		public static function get($item){
			return isset($_GET[$item]) ? $_GET[$item] : null;
		}

		public static function session($key, $val = null){
			@session_start();
			if($val){
				$_SESSION[$key] = $val;
			} else {
				return isset($_SESSION[$key]) ? $_SESSION[$key] : '';
			}
		}

		public static function removeSession($key){
			if($key){
				$_SESSION[$key] = null;
			}
		}
		
		public static function redirect($url){
			header('Location: ' . $url);
			exit();
		}

		public static function security(){
			if(!Cls::session('usercode')){
				Cls::redirect(URL . 'index.php');
			}
		}

		public static function responeJson($obj){
			header('Content-Type: application/json');
			echo json_encode($obj);
			exit();
		}

	}




?>