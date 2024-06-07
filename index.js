const express = require('express');
const bodyParser = require('body-parser');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
const connectDB = require('./config/database');

const app = express();

// Menghubungkan ke database
connectDB();

app.use(bodyParser.json());

// Konfigurasi Swagger
const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'Simple Task Manager',
      version: '1.0.0',
      description: 'API Manajemen Tugas Sederhana',
    },
  },
  apis: ['./routes/*.js'],
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Rute API
const taskRoutes = require('./routes/task');
app.use('/tasks', taskRoutes);

// Jalankan server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server berjalan di http://localhost:${PORT}`);
});
// ... konfigurasi sebelumnya ...

// Definisi Skema untuk Swagger
/**
 * @swagger
 * components:
 *   schemas:
 *     Task:
 *       type: object
 *       required:
 *         - title
 *       properties:
 *         id:
 *           type: string
 *           description: ID otomatis yang dihasilkan
 *         title:
 *           type: string
 *           description: Judul tugas
 *         description:
 *           type: string
 *           description: Deskripsi tugas
 *         status:
 *           type: string
 *           description: Status tugas
 *           default: pending
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Waktu pembuatan tugas
 *       example:
 *         id: 60d5ec49a1d3c72bdc4d1234
 *         title: Contoh Tugas
 *         description: Ini adalah contoh tugas
 *         status: pending
 *         createdAt: 2023-06-07T00:00:00.000Z
 */
