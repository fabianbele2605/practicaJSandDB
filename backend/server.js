import express from 'express';
import mysql from 'mysql2/promise';
import cors from 'cors';
import bcrypt from 'bcrypt';

const app = express();
app.use(cors());
app.use(express.json());

// Configuración de la conexión a MySQL
const dbConfig = {
    host: 'sql5.freesqldatabase.com',
    user: 'sql5793277',
    password: 'BLb7P3c8Va',
    database: 'sql5793277',
    port: 3306
};

// Crear la conexión
let connection;
async function connectDB() {
    try {
        connection = await mysql.createConnection(dbConfig);
        console.log('Conexión exitosa a MySQL');
    } catch (err) {
        console.error('Error al conectar con la base de datos:', err.stack);
        process.exit(1);
    }
}

// Conectar a la base de datos
connectDB();

// Ruta para registrar usuarios
app.post('/register', async (req, res) => {
    const { username, password } = req.body;
    console.log('Datos recibidos para registro:', { username, password });
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        console.log('Hash generado:', hashedPassword);
        const query = 'INSERT INTO usuario (username, password) VALUES (?, ?)';
        await connection.execute(query, [username, hashedPassword]);
        res.json({ success: true, message: 'Usuario registrado correctamente' });
    } catch (err) {
        console.error('Error al registrar usuario:', err.stack);
        res.status(500).json({ success: false, message: 'Error al registrar usuario' });
    }
});

// Ruta para login
app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    console.log('Datos recibidos para login:', { username, password });

    try {
        const query = 'SELECT username, password FROM usuario WHERE username = ?';
        const [rows] = await connection.execute(query, [username]);
        console.log('Resultados de la consulta:', rows);

        if (rows.length === 0) {
            console.log('Usuario no encontrado:', username);
            return res.status(401).json({ success: false, message: 'Usuario no encontrado' });
        }

        const user = rows[0];
        const isMatch = await bcrypt.compare(password, user.password);
        console.log('Resultado de bcrypt.compare:', isMatch, 'Hash almacenado:', user.password);

        if (isMatch) {
            res.json({ success: true, user: { username: user.username } });
        } else {
            res.status(401).json({ success: false, message: 'Contraseña incorrecta' });
        }
    } catch (err) {
        console.error('Error en la consulta:', err.stack);
        res.status(500).json({ success: false, message: 'Error al conectar con el servidor' });
    }
});

// Iniciar el servidor
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});