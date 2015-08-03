<?php
	require_once 'php/common.php';
    Cls::security();
?>
<!DOCTYPE html>
<html>
<meta charset="UTF-8">
<head>
  <title>Register</title> 

  <script src="http://ajax.googleapis.com/ajax/libs/jquery/1.11.3/jquery.min.js"></script> 
 
  <script type="text/javascript" src="js/common.js"></script>
  <script type="text/javascript" src="js/moment.min.js"></script>
  <script type="text/javascript" src="js/jquery-ui-1.10.2.nonwidget.min.js"></script>
  <link rel="stylesheet" type="text/css" href="css/jquery.fileupload.css" />
  <link rel="stylesheet" href="css/bootstrap.min.css">  
  <script type="text/javascript" src="js/jquery.iframe-transport.js"></script>
  <script type="text/javascript" src="js/jquery.fileupload.js"></script>
  <script type="text/javascript" src="js/gbox.ui.js"></script>
  <script type="text/javascript" src="js/saving_info.js"></script>
  <link href="css/style.css" rel="stylesheet">
</head>

<body>							
<?php
	if(Cls::session('usercode') ==1)
		include 'headerAdmin.php';
	else
		include 'headerUser.php';
?>
<div style="clear: both">
<div class="container" style="float: left; width: 50%; display:none" id="left">
  <h2 align="center">បញ្ចូលព៌តមាន</h2><br>
  <div class="form-horizontal"  id="forminfo">
  	<div class="form-group">
      <label class="control-label col-sm-3" for="txtName">ឈ្មោះ :</label>
      <div class="col-sm-8">
         <input type="text" class="form-control" maxlength="30" name="txtName" id="txtName" placeholder="ឈ្មោះ">
         <input type="hidden" id="txtId">
      </div>
    </div>
    <div class="form-group"​>
    <label class="control-label col-sm-3" for="txtSex">ភេទ :</label>
	    <div class="radio col-sm-8">
	  		<label><input type="radio" value="ប្រុស" name="txtSex" checked="true">ប្រុស</label>
	  		<label><input type="radio" value="ស្រី" name="txtSex">ស្រី</label>
		</div>
    </div>
    <div class="form-group">
      <label class="control-label col-sm-3" for="txtPhone">លេខទូរសព្ទ៍ :</label>
      <div class="col-sm-8">          
        <input type="text" class="form-control" maxlength="10" name="txtPhone" id="txtPhone" placeholder="លេខទូរសព្ទ៍">
      </div>
    </div>
    <div class="form-group">
      <label class="control-label col-sm-3" for="txtAddress">អាស័យដ្ធាន:</label>
      <div class="col-sm-8">          
        <input type="text" class="form-control" name="txtAddress" id="txtAddress" placeholder="អាស័យដ្ធាន">
      </div>
    </div>
    <div class="form-group">
      <label class="control-label col-sm-3" for="txtIdcard">អត្តសញ្ញានប័ណ្ណ :</label>
      <div class="col-sm-8">
        <input type="text" class="form-control" maxlength="9" name="txtIdcard" id="txtIdcard" placeholder="អត្តសញ្ញានប័ណ្ណ">
      </div>
    </div>
    <div class="form-group">
      <label class="control-label col-sm-3" for="pphoto">រូបថត :</label>
      <div class="col-md-3"> 
	   		 					<a href="javascript:" class="btn_photo_x" style="display: none;">
  									<img src="img/profile.png" id="photoDeleteBtn">
  								</a>
									<img src="img/profile.png"  id="PHOTO_IMG" data-id="PHOTO_IMG"
									 style="width: 120px;height: 120px;" alt="">									 
								<form action="php/fileuploaded.php" id="formUpload1" method="post">
								  	<input id="upload" type="file" name="fileUpload" value="upload" />							  	
								</form>

	 </div>
    </div>
   
    <div class="form-group">        
      <div class="col-sm-offset-3 col-sm-8">
        <input type="button" id="btnsave" class="btn btn-default" name="btnsave" value="រក្សាទុក"/>
        <button type="reset" id="btncancel" class="btn btn-default">បោះបង់</button>
      </div>
    </div>
    <!-- </form> -->
  </div>
</div>
	<div style="overflow: hidden;">
		<h2 align="center">ព៌តមានអ្នកសន្សំបា្រក់</h2><br>
		<form class="form-horizontal"​>
		  	<div class="form-group">
		      <label class="control-label col-sm-2" for="searchname">ស្វែងរកឈ្មោះ :</label>
		      <div class="col-sm-4">
		         <input type="text" class="form-control" name="searchname" id="searchname" placeholder="ឈ្មោះ">
		      </div>
		    </div>
		</form>
		<table class="table" id="TBL_CONTENTS">
					<thead>
						<tr class="info">							
							<th style="display: none">id</th>
							<th style="width: 5%;">ល.រ</th>
							<th style="width: 15%;">ឈ្មោះ</th>
							<th style="width: 7%;">ភេទ</th>
							<th style="width: 10%;">លេខទូរសព៌្ឋ</th>
							<th style="width: 29%;">អាស័យដ្ធាន</th>
							<th style="width: 13%;">អត្តសញ្ញានប័ណ្ណ</th>
							<th style="width: 10%;">កាលបរិច្ឆទ</th>						
							<th >ព៌តមានលំអិត</th>
						</tr>
					</thead>
					<tbody>
						<tr>
							<td style="display: none;" id="cust_id">
							
							</td>
							<td id="rownum">
							
							</td>
							<td id="cust_name">
							
							</td>
							<td id="cust_sex">
							
							</td>
							<td id="cust_phone">
							
							</td>
							<td id="cust_address">
							
							</td>
							<td id="cust_id_card">
							
							</td>
							<td id="cust_start_date">
							
							</td>
							
							<td id="detail">
								<button type="button" id="btndetail" style="width: 80px;"
			data-toggle="modal" data-target="#myModal" >មើល</button>
								
							</td>
						</tr>
					</tbody>
				</table>	
			<div class="col-xs-6" style="text-align:right;">
				<ul class="pagination" style="margin:0px;">
					<li>
						<span id="page"></span>
					</li>
				</ul>
			</div>
			<div style="clear:both">
				<input style="clear:both;" type="button" id="btncreate" class="btn btn-primary"  value="បនែ្ថមអ្នកប្រើបា្រស់"/>
			</div>
	</div>	
</div>

<!-- ############################################################# -->
	<!-- Modal HTML -->
    <div id="myModal" class="modal fade">
        <div class="modal-dialog" style="width: 80%;">
            <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal" aria-hidden="true">X</button>
                    <h4 class="modal-title">ព៌តមានលំអិត</h4>
                </div>
                <div class="modal-body">
                    <table class="table" id="TBL_DCONTENTS">
					<thead>
						<tr>							
							<th style="display: none">id</th>
							<th style="width: 5%;">ល.រ</th>
							<th style="width: 15%;">ឈ្មោះ</th>
							<th style="width: 10%;">ថៃ្ងបានខ្ចី</th>
							<th style="width: 10%;">រយះពេល</th>
							<th style="width: 10%;">ថៃ្ងបព្ចាប់</th>
							<th style="width: 10%;">ស្ថានភាព</th>
							<th style="width: 10%;">ទឹកប្រាក់ខ្ចី</th>
							<th style="width: 10%;">កាលប្រាក់</th>
							<th style="width: 10%;">ចំនេញ</th>
							<th style="width: 10%;">សរុប</th>
						</tr>
					</thead>
					<tbody>
						<tr>
							<td style="display: none" id="HISID">
							
							</td>
							<td id="ROWNUM">
							
							</td>
							<td id="PNAME">
							
							</td>
							<td id="START_BORROW">
							
							</td>
							<td id="PAGE_CD">
							
							</td>
							<td id="END_BORROW">
							
							</td>
							<td id="PAGE_URL">
							
							</td>
							<td id="AMOUNT">
							
							</td>
							<td id="RATE">
							
							</td>
							
							<td id="PAGE_SZE">
							
							</td>
							
							<td id="TOTAL_PAGES">
							
							</td>
							
						</tr>
					</tbody>
				</table>
                </div>
                <div class="modal-footer">
                <div class="col-sm-6" style="text-align:right;">
					<ul class="pagination" style="margin:0px;">
						<li>
							<span id="dpage"></span>
						</li>
					</ul>
				
            </div>
        </div>
    </div>
    </div>
    </div>
<!-- ############################################################# -->
</body>
</html>