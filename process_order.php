<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Retrieve reCAPTCHA response
    $recaptchaSecret = '6LcVKAAqAAAAANqXV2MPh7I3pwLHA6YGWJd0G-ES'; // Replace with your reCAPTCHA secret key
    $recaptchaResponse = $_POST['g-recaptcha-response'];
    
    // Verify reCAPTCHA response
    $recaptchaUrl = 'https://www.google.com/recaptcha/api/siteverify';
    $recaptchaData = array(
        'secret' => $recaptchaSecret,
        'response' => $recaptchaResponse
    );

    $options = array(
        'http' => array(
            'header'  => "Content-type: application/x-www-form-urlencoded\r\n",
            'method'  => 'POST',
            'content' => http_build_query($recaptchaData),
        ),
    );

    $context  = stream_context_create($options);
    $result = file_get_contents($recaptchaUrl, false, $context);
    $resultJson = json_decode($result);

    if ($resultJson->success !== true) {
        echo 'reCAPTCHA verification failed. Please try again.';
    } else {
        // Retrieve form data
        $name = htmlspecialchars($_POST['name']);
        $email = htmlspecialchars($_POST['email']);
        $phone = htmlspecialchars($_POST['phone']);
        $address = htmlspecialchars($_POST['address']);
        $message = htmlspecialchars($_POST['productDetails']);

        // Set up email details
        $to = "wholesale@liibaangroup.com"; // Replace with your email
        $subject = "New Product Order";
        $headers = "From: " . $email . "\r\n";
        $headers .= "Reply-To: " . $email . "\r\n";
        $headers .= "Content-Type: text/html; charset=UTF-8\r\n";

        // Construct the email body
        $email_body = "<h2>Product Order</h2>";
        $email_body .= "<p><strong>Name:</strong> {$name}</p>";
        $email_body .= "<p><strong>Email:</strong> {$email}</p>";
        $email_body .= "<p><strong>Phone Number:</strong> {$phone}</p>";
        $email_body .= "<p><strong>Address:</strong> {$address}</p>";
        $email_body .= "<p><strong>Product Details:</strong><br>{$message}</p>";

        // Send the email
        if (mail($to, $subject, $email_body, $headers)) {
            echo "Order submitted successfully!";
        } else {
            echo "Order submission failed!";
        }
    }
} else {
    echo "Invalid request";
}
?>
