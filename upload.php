<?php
	$upload_dir = "upload/";
	$data = $_POST['img'];
	$file = $upload_dir . mktime() . ".jpg";
	$uri =  substr($data, strpos($data, ",")+1);
	file_put_contents($file, base64_decode($uri));
	echo json_encode($file);
?>