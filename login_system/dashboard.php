<?php
session_start();
if (!isset($_SESSION['user_id'])) {
    header("Location: login.html");
    exit();
}
$username = isset($_SESSION['username']) ? htmlspecialchars($_SESSION['username']) : "Guest";
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Dashboard</title>
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600&display=swap">
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
            font-family: 'Poppins', sans-serif;
        }

        body {
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            height: 100vh;
            background: url('communitybg.png') no-repeat center center fixed;
            background-size: cover;
            position: relative;
            overflow: hidden;
        }

        /* Dark Overlay for Readability */
        body::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            backdrop-filter: blur(1px);
            z-index: -1;
        }

        /* Glassmorphism Header */
        header {
            background: rgba(255, 255, 255, 0.15);
            backdrop-filter: blur(15px);
            border-radius: 15px;
            padding: 30px 50px;
            text-align: center;
            color: white;
            width: 80%;
            max-width: 600px;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
            border: 1px solid rgba(255, 255, 255, 0.3);
            transition: transform 0.3s ease-in-out;
        }

        header:hover {
            transform: scale(1.02);
        }

        header h2 {
            font-size: 2.2rem;
            font-weight: 600;
            margin-bottom: 15px;
        }

        /* Button Container */
        .button-container {
            margin-top: 20px;
            display: flex;
            justify-content: center;
            gap: 15px;
        }

        /* Modern Glass Button Styling */
        .button-container a {
            text-decoration: none;
            font-size: 1rem;
            font-weight: 500;
            color: white;
            padding: 12px 30px;
            border-radius: 8px;
            background: rgba(255, 255, 255, 0.2);
            border: 1px solid rgba(255, 255, 255, 0.3);
            transition: all 0.3s ease-in-out;
            box-shadow: 3px 3px 10px rgba(0, 0, 0, 0.3);
        }

        .button-container a:hover {
            background: rgba(255, 255, 255, 0.4);
            transform: translateY(-3px);
            box-shadow: 0px 10px 20px rgba(0, 0, 0, 0.2);
        }

        .button-container a:active {
            transform: scale(0.95);
        }

        /* Subtle Footer */
        footer {
            margin-top: 40px;
            font-size: 0.85rem;
            color: #ccc;
            text-align: center;
        }

        /* Responsive Design */
        @media (max-width: 768px) {
            header {
                width: 90%;
                padding: 25px 35px;
            }

            header h2 {
                font-size: 1.8rem;
            }

            .button-container {
                flex-direction: column;
                gap: 10px;
            }

            .button-container a {
                width: 100%;
                text-align: center;
            }
        }
    </style>
</head>
<body>
    <header>
        <h2>Welcome, <?php echo $username; ?>!</h2>
        <div class="button-container">
            <a href="diary.php">Diary</a>
            <a href="community.php">Community</a>
            <a href="logout.php">Logout</a>
        </div>
    </header>

    <footer>
        <p>&copy; 2025 SereneSphere | All rights reserved</p>
    </footer>
</body>
</html>
