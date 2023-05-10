<!DOCTYPE html>
<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
        <title><?php echo $_GET['title'];?></title>
        <meta property="og:title" content="<?php echo $_GET['title'];?>" />
        <meta property="og:description" content="<?php echo $_GET['desc'];?> "/>
        <meta property="og:image" content="<?php echo $_GET['thumb'];?>"/>
        <meta property="og:image:width" content="<?php echo $_GET['width'];?>"/>
	<meta property="og:image:height" content="<?php echo $_GET['height'];?>"/>
    </head>
    <body>
        <script>
           // window.location.href = "<?php echo $_GET['url'];?>";
        </script>
    </body>

</html>