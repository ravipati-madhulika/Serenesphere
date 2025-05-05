<?php
$servername = "localhost";
$username = "root";
$password = ""; // Leave this empty for XAMPP
$dbname = "login_system"; // Your database name

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}
?>
