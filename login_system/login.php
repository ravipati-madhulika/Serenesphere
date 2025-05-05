<?php
session_start();
include 'db_connect.php';

error_reporting(E_ALL);
ini_set('display_errors', 1);

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $username = $_POST['username'];
    $password = $_POST['password'];

    $sql = "SELECT id, password FROM users WHERE username=?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("s", $username);
    $stmt->execute();
    $stmt->store_result();
    $stmt->bind_result($id, $hashed_password);
    $stmt->fetch();

    // Debugging Output
    echo "Username: $username <br>";
    echo "Rows Found: " . $stmt->num_rows . "<br>";

    if ($stmt->num_rows > 0) {
        echo "Hashed Password from DB: $hashed_password <br>";
        echo "Entered Password: $password <br>";

        if (password_verify($password, $hashed_password)) {
            $_SESSION['user_id'] = $id;
            $_SESSION['username'] = $username;
            header("Location: dashboard.php"); // Redirect to dashboard
            exit();
        } else {
            echo "Incorrect password!<br>";
        }
    } else {
        echo "User not found!<br>";
    }

    $stmt->close();
    $conn->close();
}
?>
