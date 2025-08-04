<?php
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require 'vendor/autoload.php';

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Get form data
    $service = $_POST['service'];
    $price = $_POST['price'];
    $date = $_POST['date'];
    $time = $_POST['time'];
    $timeOfDay = $_POST['timeOfDay'];
    $name = $_POST['name'];
    $email = $_POST['email'];
    $phone = $_POST['phone'];
    $notes = $_POST['notes'] ?? 'None';

    // Create email content
    $customer_subject = "Your HIM Barbershop Appointment Confirmation";
    $admin_subject = "New Booking: $service for $name";
    
    $message = "
    <h2>Appointment Details</h2>
    <p><strong>Service:</strong> $service</p>
    <p><strong>Price:</strong> $$price</p>
    <p><strong>Date:</strong> $date</p>
    <p><strong>Time:</strong> $time ($timeOfDay)</p>
    <p><strong>Special Requests:</strong> $notes</p>
    <hr>
    <h3>Customer Information</h3>
    <p><strong>Name:</strong> $name</p>
    <p><strong>Email:</strong> $email</p>
    <p><strong>Phone:</strong> $phone</p>
    ";

    try {
        // Send to customer
        $mail = new PHPMailer(true);
        $mail->isSMTP();
        $mail->Host = 'your-smtp-host.com'; // Your SMTP server
        $mail->SMTPAuth = true;
        $mail->Username = 'your@email.com'; // SMTP username
        $mail->Password = 'yourpassword'; // SMTP password
        $mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS;
        $mail->Port = 465;
        
        $mail->setFrom('bookings@himbarbershop.com', 'HIM Barbershop');
        $mail->addAddress($email, $name);
        $mail->isHTML(true);
        $mail->Subject = $customer_subject;
        $mail->Body = $message;
        $mail->send();

        // Send to admin
        $mail->clearAddresses();
        $mail->addAddress('admin@himbarbershop.com', 'HIM Admin');
        $mail->Subject = $admin_subject;
        $mail->Body = $message;
        $mail->send();

        // Return success response
        header('Location: index.html?booking=success');
        exit();
    } catch (Exception $e) {
        header('Location: index.html?booking=error');
        exit();
    }
}
?>