<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Recibir los datos del formulario
    $username = $_POST['username'];
    $password = $_POST['password'];

    // Aquí puedes agregar lógica para validar el usuario, por ejemplo, consultando una base de datos
    // En este ejemplo, simplemente se imprime en la pantalla

    echo "Usuario: " . htmlspecialchars($username) . "<br>";
    echo "Contraseña: " . htmlspecialchars($password) . "<br>";

    // Si estuvieras usando una base de datos, aquí es donde verificarías las credenciales
    // Y podrías redirigir al usuario o mostrar un mensaje de error
}
?>
