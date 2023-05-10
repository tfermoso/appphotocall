<?php
    # we are a PNG image
    header('Content-type: image/png');
     
    # we are an attachment (eg download), and we have a name
    header('Content-Disposition: attachment; filename="' . $_POST['name'] .'"');
     
    #capture, replace any spaces w/ plusses, and decode
    $encoded = $_POST['imgdata'];

	$img = str_replace('data:image/png;base64,', '', $encoded);
	$img = str_replace(' ', '+', $img);
	$decoded = base64_decode($img);

	#write decoded data
	echo $decoded;
?>