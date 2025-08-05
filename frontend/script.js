document.getElementById("loginForm").addEventListener("submit", async (event) => {
    event.preventDefault();

    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value.trim();
    console.log('Datos enviados:', { username, password });

    try {
        const response = await fetch('http://localhost:3000/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        });

        const result = await response.json();
        console.log('Respuesta del servidor:', result);

        if (result.success) {
            localStorage.setItem('user', JSON.stringify(result.user));
            window.location.href = "dashboard.html";
        } else {
            alert(result.message || 'Usuario o contraseña inválidos.');
        }
    } catch (err) {
        console.error('Error al intentar iniciar sesión:', err);
        alert('Error al conectar con el servidor');
    }
});