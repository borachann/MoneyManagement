 <?php 
	require_once 'php/common.php';
    Cls::security();
?>
<html>
<meta charset="UTF-8">
	<head>
		<title>Borrowing</title>
  <link rel="stylesheet" type="text/css" href="css/jquery.fileupload.css" />
  <link rel="stylesheet" href="css/bootstrap.min.css"> 
  <link href="css/style.css" rel="stylesheet"> 
  <link rel="stylesheet" href="css/jquery-ui.css">
  <script src="js/jquery.min.js"></script> 
  <script type="text/javascript" src="js/common.js"></script>
  <script type="text/javascript" src="js/moment.min.js"></script>
  <script type="text/javascript" src="js/jquery-ui-1.10.2.nonwidget.min.js"></script>  
  <script type="text/javascript" src="js/jquery.iframe-transport.js"></script>
  <script type="text/javascript" src="js/jquery.fileupload.js"></script>
  <script type="text/javascript" src="js/gbox.ui.js"></script>  
  <script type="text/javascript" src="js/borrow_info.js"></script>
  <script type="text/javascript" src="js/jquery-ui.js"></script>
  <script type="text/javascript" src="js/common/jquery.ui.autocomplete.scroll.min.js"></script>
  <script type="text/javascript" src="js/xregexp-all.js"></script>
  <script type="text/javascript" src="js/jquery.ui.datepicker-ko.js"></script>
  <script type="text/javascript" src="js/jquery.table2excel.js"></script>
	</head>
	<body  style="overflow: hidden;">

<?php
	if(Cls::session('usercode') ==1)
		include 'headerAdmin.php';
	else
		include 'headerUser.php';
?>
<script type="text/javascript">
	var user_id = <?= Cls::session('usercode') ?>;		
</script>
<div style="clear: both;"></div>
	<h2 align="center">ផ្តល់ប្រាក់កម្ចី</h2><br>
		<form class="form-horizontal"​ action="php/borrow_info_script.php" method="post" name="frmBorrow" id="frmBorrow">
		  	<input type="hidden" name="custId" id="custId">
		  			<div class="form-group" style="width:100%; margin-bottom: 0;">
                		<div class="col-md-5">                            
                                <div class="form-group">
                                    <label class="control-label col-sm-5" for="bname">បញ្ចូលឈ្មោះ :</label>
                                    <div class="col-sm-7 ui-widget">
                                        <input type="text" name="bname" class="form-control" id="bname" placeholder="ឈ្មោះ">
                                    </div>                                    
                                </div>
                                <div class="form-group">
                                    <label class="col-sm-5 control-label">ភេទ :</label>
                                    <div class="col-sm-7">
                                        <input type="text" style="padding-bottom: 0; padding-top: 0;" name="bsex" class="form-control" placeholder="ភេទ" readonly id="bsex">
                                    </div>
                                </div>
                                <div class="form-group">
                                    <label class="col-sm-5 control-label">ចំនួនទឹកបា្រក់ : </label>
                                    <div class="col-sm-7">
                                        <input type="text" maxlength="10" class="form-control" maxlength="11" disabled="true" placeholder="ចំនួនប្រាក់" name="bamount" id="bamount">
                                    </div>
                                </div>
                                <div class="form-group">
                                    <label class="col-sm-5 control-label">កាលបា្រក់ : </label>
                                    <div class="col-sm-7">
                                        <input type="text" maxlength="10" class="form-control" maxlength="11" disabled="true" placeholder="កាលប្រាក់" name="brate" id="brate">
                                    </div>
                                </div>                                
                                
                        </div>   					
	   		 			<div class="col-md-7"> 
	   		 					<div>
									<img src="img/profile.png" id="PHOTO_IMG" data-id="PHOTO_IMG"
									 style="width: 130px;height: 130px; margin-bottom: 20px;">
								</div>
								<div class="form-group">
                                     <label class="col-sm-2 control-label" style="text-align: left; padding-right: 0;">
                                    ប្រាក់ត្រូវសងក្នុងមួយថ្ងៃ : </label>
                                    <div class="col-sm-3">
                                        <input type="text"  class="form-control" readonly="readonly" placeholder="ចំនូន" name="perday" id="perday">
                                    </div>
                                </div>
	  					</div>   					
   					</div>

   					<div class="form-group">
   						<div class="col-md-12">                                    
                                    <label class="col-sm-2 control-label">រយះពេលបានសង :</label>
                                    <div class="col-sm-1">
                                        <input type="text" readonly="readonly" class="form-control" placeholder="ចំនូន" name="totalday" id="totalday">
                                    </div>                                
	                                <label class="col-sm-1 control-label" style="text-align: left; padding-left: 0;">ចំនួនប្រាក់បានសង : </label>
	                                <div class="col-sm-1">
	                                    <input type="text" readonly="readonly" style="margin-left: -30px; width: 111%;" class="form-control" placeholder="ទឹកប្រាក់" name="totalamount" id="totalpaid">
	                                </div>
                                    <label class="col-sm-1 control-label" style="text-align: left; padding-left: 0;">ប្រាក់នៅសល់ : </label>
                                    <div class="col-sm-2">
                                        <input type="text" readonly="readonly"  style="margin-left: 10px; width: 87%;"class="form-control" placeholder="ទឹកប្រាក់" name="totalamount" id="totalAmount">
                                    </div>
                        </div>                                
					</div>
					<div class="form-group" style=" margin-bottom: 0; width: 100%;  "> 							      
							      	<div class="col-md-5" style="text-align: left;">
										<form role="form">
											<label class="checkbox-inline">
												ស្ងានភាព : 
											</label>
										    <label class="checkbox-inline">
										      <input type="checkbox" id='all' checked="checked" name="TX_CD" value="">ទាំងអស់
										    </label>
										    <label class="checkbox-inline">
										      <input type="checkbox" id='con' name="TX_CD" value="con">បន្ត
										    </label>
										    <label class="checkbox-inline">
										      <input type="checkbox" id='fin' name="TX_CD" value="fin">បញ្ចប់
										    </label>
										    <label class="checkbox-inline" style="width: 59%;">											 
											    <input type="text" class="form-control" name="searchname" id="searchname" placeholder="ស្វែងរក ឈ្មោះ">
										     </label>
							  			</form>
									</div>
					</div>
		</form>
	
		<table class="table" id="TBL_CONTENTS">
					<thead class="primary">
						<tr>							
							<th style="display: none">id</th>
							<th style="width: 5%;">ល.រ</th>
							<th style="width: 15%;">ឈ្មោះ</th>
							<th style="width: 10%;">ថៃ្ងបានខ្ចី</th>
							<th style="width: 10%;">រយះពេលបានសង</th>
							<th style="width: 10%;">ស្ថានភាព</th>
							<th style="width: 10%;">ទឹកប្រាក់ខ្ចី</th>
							<th style="width: 10%;">កាលប្រាក់</th>
							<th style="width: 10%;">ប្រាក់/ថ្ងៃ</th>
							<th style="width: 10%;">សរុប</th>							
							<th style="width: 10%;">ព័ត៌មានលំអឹត</th>
						</tr>
					</thead>
					<tbody>
						<tr>
							<td style="display: none" id="lend_id">
							
							</td>
							<td id="rownum">
							
							</td>
							<td id="cust_name">
							
							</td>
							<td id="lend_start">
							
							</td>
							<td id="during">
							
							</td>
							<td id="lend_status">
							
							</td>							
							<td id="lend_amount">
							
							</td>
							<td id="lend_rate">
							
							</td>
							
							<td id="perday">
							
							</td>
							
							<td id="total">
							
							</td>	

							<td>
								<input type="button" id='btndetail' style="width: 80px;" value="មើល">
							</td>						
						</tr>
					</tbody>
				</table>	
			<div class="col-sm-6" style="text-align:right;">
				<ul class="pagination" style="margin:0px;">
					<li>
						<span id="page"></span>
					</li>
				</ul>
			</div>
				<div style="float: right; margin-right: 10px;">
									<input type="button" id="btnprint" class="btn btn-default" value="ទាញយក" />
							        <input type="button" id="btnsave" disabled class="btn btn-default" value="រក្សាទុក"/>
							        <button type="reset" id="btncancel" class="btn btn-default">បោះបង់</button>
				</div>
			
	</body>
	  <script type="text/javascript">
	var user_id = <?= Cls::session('usercode') ?>;	
  </script>	
</html>
 