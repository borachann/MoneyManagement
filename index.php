<?php
    require_once 'php/common.php';
?>
<html>
<meta charset="UTF-8">
 	<head> 	
		<script type="text/javascript" src="js/jquery.min.js"></script>
		<link rel="stylesheet" href="http://maxcdn.bootstrapcdn.com/bootstrap/3.2.0/css/bootstrap.min.css"> 
		<script src="js/common.js"></script>
		<script type="text/javascript" src="js/index.js"></script>	
        <script type="text/javascript" src="js/common.js"></script>
        <link href="css/style.css" rel="stylesheet">  
		<title>Welcome to Money Management</title>    
	</head>
<body>

   <div class="container">  
  
        <div id="loginbox" style="margin-top:50px;" class="mainbox col-md-6 col-md-offset-3 col-sm-8 col-sm-offset-2">  
                            
            <div class="panel panel-info" >
                    <div class="panel-heading">
                        <div class="panel-title">Welcome to Money Management</div>
                    </div>     
 
                    <div style="padding-top:30px" class="panel-body" >
                        <form id="loginform" class="form-horizontal"  action="php/index.php" method="post">
                                    
                            <div style="margin-bottom: 25px" class="input-group">
                                        <span class="input-group-addon"><i class="glyphicon glyphicon-user"></i></span>
                                        <input id="userEmail" type="text" class="form-control" name="username" value="" placeholder="ឈ្មោះអ្នកប្រើប្រាស់" autocomplete="off">  
                                    </div>
                                
                            <div style="margin-bottom: 25px" class="input-group">
                                        <span class="input-group-addon"><i class="glyphicon glyphicon-lock"></i></span>
                                        <input id="passwd" type="password" class="form-control" name="password" placeholder="ពាក្យសំងាត់" autocomplete="off">
                                    </div>
                                <div style="margin-top:10px" class="form-group">
                                    <!-- Button -->

                                    <div class="col-sm-12 controls">
                                      <!-- <a id="btnsubmit" style="width: 100%;" href="javascript:submit()" class="btn btn-primary">Login</a> -->
                                        <input class="btn btn-primary" type="submit" value="Login">
                                    </div>
                                </div>                                   
                            </form> 

                        </div>                     
                    </div>  

        </div>
        
    </div>

</body>
  
</html>