<?php
session_start();
if (!isset($_SESSION['user_id'])) {
    header("Location: login.html");
    exit();
}

include 'db_connect.php';

$user_id = $_SESSION['user_id'];
$message = "";

// Handle Post Submission
if ($_SERVER["REQUEST_METHOD"] == "POST" && isset($_POST['content'])) {
    $content = trim($_POST['content']);
    $image = null;

    // Handle image upload
    if (isset($_FILES['image']) && $_FILES['image']['error'] == 0) {
        $imageTmpPath = $_FILES['image']['tmp_name'];
        $imageName = basename($_FILES['image']['name']);
        $imagePath = 'uploads/' . $imageName;

        // Move the uploaded image to the uploads folder
        if (move_uploaded_file($imageTmpPath, $imagePath)) {
            $image = $imagePath;
        }
    }

    if (!empty($content) || $image) {
        $sql = "INSERT INTO posts (user_id, content, image) VALUES (?, ?, ?)";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("iss", $user_id, $content, $image);

        if ($stmt->execute()) {
            $message = "Post added!";
        } else {
            $message = "Error posting!";
        }
        $stmt->close();
    } else {
        $message = "Cannot post empty content!";
    }
}

// Fetch all posts (newest first)
$sql = "SELECT posts.id, posts.content, posts.image, posts.created_at, users.username 
        FROM posts 
        JOIN users ON posts.user_id = users.id 
        ORDER BY posts.created_at DESC";
$result = $conn->query($sql);

$posts = [];
while ($row = $result->fetch_assoc()) {
    $posts[] = $row;
}

$conn->close();
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Community</title>
    <style>
        body {
            font-family: 'Arial', sans-serif;
            background-color: #f4f6f9;
            margin: 0;
            padding: 0;
            color: #333;
            background: url('communitybg.png') no-repeat center center fixed;
            background-size: cover;
}

        

        header {
            background-color: #2c3e50;
            color: white;
            padding: 20px;
            text-align: center;
        }

        h2 {
            margin: 0;
            font-size: 2rem;
        }

        .button-container {
            margin-top: 15px;
        }

        .button-container a {
            text-decoration: none;
            background-color: #3498db;
            padding: 10px 20px;
            margin: 5px;
            border-radius: 5px;
            color: white;
            font-weight: bold;
            transition: background-color 0.3s;
        }

        .button-container a:hover {
            background-color: #2980b9;
        }

        .container {
            display: flex;
            justify-content: center;
            align-items: flex-start;
            padding: 20px;
            gap: 40px;
            max-width: 1200px;
            margin: auto;
        }

        .left-section, .right-section {
            width: 48%;
            background-color: white;
            padding: 20px;
            border-radius: 10px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        }

        .left-section h3, .right-section h3 {
            font-size: 1.5rem;
            margin-bottom: 20px;
            color: #2c3e50;
        }

        .left-section form {
            display: flex;
            flex-direction: column;
        }

        .left-section form label {
            margin-bottom: 5px;
            font-weight: bold;
        }

        .left-section form textarea, .left-section form input[type="file"] {
            margin-bottom: 15px;
            padding: 10px;
            border: 1px solid #ccc;
            border-radius: 5px;
            font-size: 1rem;
            outline: none;
        }

        .left-section form button {
            background-color: #3498db;
            color: white;
            padding: 10px;
            border: none;
            border-radius: 5px;
            font-size: 1rem;
            cursor: pointer;
            transition: background-color 0.3s;
        }

        .left-section form button:hover {
            background-color: #2980b9;
        }

        .right-section .post-box {
            background-color: #ecf0f1;
            padding: 15px;
            border-radius: 10px;
            margin-bottom: 20px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.05);
        }

        .post-box p {
            font-size: 1rem;
            line-height: 1.6;
            color: #34495e;
        }

        .post-box img {
            max-width: 100%;
            margin-top: 10px;
            border-radius: 5px;
        }

        .message {
            color: #e74c3c;
            margin-bottom: 20px;
        }
    </style>
</head>
<body>
    <header>
        <h2>Welcome, <?php echo htmlspecialchars($_SESSION['username']); ?>!</h2>
        <div class="button-container">
            <a href="dashboard.php" class="button">Dashboard</a>
            <a href="logout.php" class="button">Logout</a>
        </div>
    </header>

    <div class="container">
        <!-- Left Section for Posting -->
        <div class="left-section">
            <h3>Create a Post</h3>
            <form method="POST" enctype="multipart/form-data">
                <label for="content">Content:</label>
                <textarea name="content" rows="4" cols="50"></textarea>

                <label for="image">Upload Image:</label>
                <input type="file" name="image" accept="image/*">

                <button type="submit">Post</button>
            </form>
            <p class="message"><?php echo htmlspecialchars($message); ?></p>
        </div>

        <!-- Right Section for Displaying Posts -->
        <div class="right-section">
            <h3>Recent Posts</h3>
            <?php foreach ($posts as $post): ?>
                <div class="post-box">
                    <p><strong><?php echo htmlspecialchars($post['username']); ?></strong> - <?php echo htmlspecialchars($post['created_at']); ?></p>
                    <p><?php echo nl2br(htmlspecialchars($post['content'])); ?></p>
                    <?php if ($post['image']): ?>
                        <img src="<?php echo htmlspecialchars($post['image']); ?>" alt="Post Image">
                    <?php endif; ?>
                </div>
            <?php endforeach; ?>
        </div>
    </div>
</body>
</html>
