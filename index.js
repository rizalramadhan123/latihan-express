const express = require('express');
const ejs = require('ejs');
const path = require('path');
const mongoose = require('mongoose');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
const ConnectDatabase = require('./config/database');

const app = express();
app.engine('html', ejs.renderFile); // Menggunakan ejs untuk merender file HTML
app.set('view engine', 'html');
app.set('views', path.join(__dirname, 'views'));

app.use(express.json());

ConnectDatabase();

// Konfigurasi Swagger
const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'API Penyewaan Buku',
      version: '1.0.0',
      description: 'Dokumentasi API untuk penyewaan buku',
    },
  },
  apis: ['./routes/*.js'],
};


app.get('/', (req, res) => {
  // Render halaman dengan EJS
  res.render('index');
});

app.get('/penyewaan', (req, res) => {
  // Render halaman dengan EJS
  res.render('sewa');
});

app.get('/algoritma', (req, res) => {
  //soal 1
  const soal1String = 'NEGIE1';
  const numberString = soal1String.replace(/\D/g, '');
  const alphabetString = soal1String.replace(/[^a-zA-Z]/g, '');

  let newSoal1String = '';

  for(let i = alphabetString.length - 1; i >= 0; i--) {
    newSoal1String += alphabetString[i];
  }
  newSoal1String += numberString;
  const soal1 = newSoal1String;

  //soal2
  const kata = "Saya sangat suka belajar javascript dan suka php".split(" ");
  let kataPanjang = "";
  
  for (const k of kata) {
    if (k.length > kata.length) {
      kataPanjang = k;
    }
  }

  const soal2 = kataPanjang +'('+kataPanjang.length+')';

  //soal3
  const INPUT = ['xc', 'dz', 'bbb', 'dz'];
  const QUERY = ['bbb', 'ac', 'dz'];

  const wordCount = INPUT.reduce((acc, word) => {
    acc[word] = (acc[word] || 0) + 1;
    return acc;
  }, {});

  const soal3 = QUERY.map(word => wordCount[word] || 0);
  //soal4
  const matrix = [[1, 2, 0], [4, 5, 6], [7, 8, 9]];

  let diagonal1Sum = 0;
  let diagonal2Sum = 0;

  for (let i = 0; i < matrix.length; i++) {
    diagonal1Sum += matrix[i][i];
    diagonal2Sum += matrix[i][matrix.length - 1 - i];
  }

  const soal4 = Math.abs(diagonal1Sum - diagonal2Sum);
  
  res.render('algoritma',{
    soal1: soal1,
    soal2: soal2,
    soal3: soal3,
    soal4: soal4,
  });
});

const swaggerDocs = swaggerJsdoc(swaggerOptions);
app.use('/api', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Tambahkan rute untuk books, dan members
const bookRouter = require('./routes/books');
const memberRouter = require('./routes/members');
const sewaRouter = require('./routes/sewa');

app.use('/books', bookRouter);
app.use('/members', memberRouter);
app.use('/sewa',sewaRouter);

// Jalankan server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
