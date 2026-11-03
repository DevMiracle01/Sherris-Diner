<?php
$conn = mysqli_connect("localhost", "root", "", "blog");
if (!$conn) {
    echo "not connected".mysqli_error($conn);
}
?>