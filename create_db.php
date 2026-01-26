<?php
$mysqli = new mysqli("127.0.0.1", "root", "");
if ($mysqli->connect_error) {
    die("Connection failed: " . $mysqli->connect_error);
}
if ($mysqli->query("CREATE DATABASE IF NOT EXISTS hris")) {
    echo "Database created successfully";
} else {
    echo "Error creating database: " . $mysqli->error;
}
$mysqli->close();
?>
