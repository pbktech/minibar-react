<?php
if (file_exists(dirname(__DIR__) . '/config.json')) {
    $cf=dirname(__DIR__) . '/config.json';
} else {
    $cf='/var/www/html/config.json';
}
$config = json_decode(file_get_contents($cf));
$mysqli = new mysqli($config->host, $config->username, $config->password, "pbc2");
$stmt = $mysqli->stmt_init();
$stmt->prepare("SELECT company,imageFile,linkSlug,restaurantID,services FROM pbc_minibar where isActive=1");
$stmt->execute();
$result = $stmt->get_result();
while ($row = $result->fetch_object()) {
    $info=json_decode($row->imageFile);
    $services=array();
    foreach (json_decode($row->services) as $name=>$s) {
        if (isset($s->day) && count($s->day)!=0) {
            $menus=array();
            foreach ($s->menu as $menu) {
              $stmt1 = $mysqli->stmt_init();
              $stmt1->prepare("SELECT * FROM pbc_ToastMenu WHERE restaurantID = ? AND GUID=?");
              $stmt1->bind_param("ss",$row->restaurantID,$menu);
              $stmt1->execute();
              $result1 = $stmt1->get_result();
                while ($rows = $result1->fetch_object()) {
                    $menus[]=$rows->menuGroups;
                }
            }
            $services[]=array("name"=>$name,"menus"=>$menus);
        }
    }
    $locations["locations"][]=array(
    "name"=>$row->company,
    "lat"=>$info->lat,
    "long"=>$info->long,
    "address"=>$info->addressa,
    "suite"=>$info->addressb,
    "city"=>$info->city,
    "state"=>$info->state,
    "zip"=>$info->zip,
    "link"=>$row->linkSlug,
    "services"=>$services
  );
}
header('Content-Type: application/json');
echo json_encode($locations);
