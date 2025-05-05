<?php
session_start();
if (!isset($_SESSION['user_id'])) {
    header("Location: index.html"); // Redirect to login if not logged in
    exit();
}

include 'db_connect.php';

$user_id = $_SESSION['user_id'];
$message = "";

// Handle note submission
if ($_SERVER["REQUEST_METHOD"] == "POST" && isset($_POST['date'], $_POST['note'])) {
    $date = $_POST['date'];
    $note = $_POST['note'];

    $sql = "INSERT INTO notes (user_id, note_date, note_text) VALUES (?, ?, ?)";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("iss", $user_id, $date, $note);

    if ($stmt->execute()) {
        $message = "Note saved!";
    } else {
        $message = "Error saving note.";
    }
    $stmt->close();
}

// Fetch existing notes
$sql = "SELECT note_date, note_text FROM notes WHERE user_id = ? ORDER BY note_date ASC";
$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $user_id);
$stmt->execute();
$result = $stmt->get_result();

$notes = [];
while ($row = $result->fetch_assoc()) {
    $notes[$row['note_date']] = $row['note_text'];
}
$stmt->close();
$conn->close();
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>My Diary</title>
    <link rel="stylesheet" href="style.css"> <!-- Link to CSS -->
</head>
<body>
    <header>
        <h2 class="welcome">HaLOooOooo, <?php echo htmlspecialchars($_SESSION['username']); ?>!</h2>
        <div class="button-container">
            <a href="logout.php" class="logout">Logout</a>
            <button id="toggle-notes">Show Notes</button>
        </div>
    </header>

    <div class="diary-container">
        <p class="message"><?php echo htmlspecialchars($message); ?></p>

        <form method="POST">
            <label for="date">Select Date:</label>
            <input type="date" name="date" required>
            
            <label for="note">Your Note:</label>
            <textarea name="note" required></textarea>

            <button type="submit">Save Note</button>
        </form>
    </div>

    <div class="notes-section" id="notes-section">
        <h3>Your Notes</h3>
        <ul>
            <?php foreach ($notes as $date => $text): ?>
                <li><strong><?php echo htmlspecialchars($date); ?>:</strong> <?php echo htmlspecialchars($text); ?></li>
            <?php endforeach; ?>
        </ul>
    </div>
   
    <script>
        // Toggle Notes Section On/Off
        document.getElementById("toggle-notes").addEventListener("click", function() {
            var notesSection = document.getElementById("notes-section");
            if (notesSection.style.display === "none" || notesSection.style.display === "") {
                notesSection.style.display = "block";
                this.textContent = "Hide Notes";
            } else {
                notesSection.style.display = "none";
                this.textContent = "Show Notes";
            }
        });
    </script>
</body>
</html>