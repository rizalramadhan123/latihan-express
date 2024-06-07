const express = require('express');
const router = express.Router();
const Books = require('../models/Books');

/**
 * @swagger
 * components:
 *   schemas:
 *     Books:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: ID otomatis yang dihasilkan
 *         code:
 *           type: string
 *           description: Kode buku
 *         title:
 *           type: string
 *           description: Judul buku
 *         author:
 *           type: string
 *           description: Penulis buku
 *         stock:
 *           type: integer
 *           description: Jumlah stok buku
 *       example:
 *         id: 60d5ec49a1d3c72bdc4d5678
 *         code: JK-45
 *         title: Harry Potter
 *         author: J.K Rowling
 *         stock: 1
 */

/**
 * @swagger
 * /books:
 *   get:
 *     summary: Retrieve all books
 *     responses:
 *       200:
 *         description: A list of books
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Books'
 *   post:
 *     summary: Create a new books
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Books'
 *     responses:
 *       201:
 *         description: Books created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Books'
 */
router.get('/', async (req, res) => {
  try {
    const books = await Books.find();
    res.json(books);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/', async (req, res) => {
  const books = new Books({
    code: req.body.code,
    title: req.body.title,
    author: req.body.author,
    stock: req.body.stock,
  });
  try {
    const newBooks = await books.save();
    res.status(201).json(newBooks);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

/**
 * @swagger
 * /books/{id}:
 *   get:
 *     summary: Get a books by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the books to get
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Books found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Books'
 *       404:
 *         description: Books not found
 *   put:
 *     summary: Update a books by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the books to update
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Books'
 *     responses:
 *       200:
 *         description: Books updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Books'
 *       404:
 *         description: Books not found
 *   delete:
 *     summary: Delete a books by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the books to delete
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Books deleted successfully
 *       404:
 *         description: Books not found
 */
router.get('/:id', getBooks, (req, res) => {
  res.json(res.books);
});

router.put('/:id', getBooks, async (req, res) => {
  if (req.body.code != null) {
    res.books.code = req.body.code;
  }
  if (req.body.title != null) {
    res.books.title = req.body.title;
  }
  if (req.body.author != null) {
    res.books.author = req.body.author;
  }
  if (req.body.stock != null) {
    res.books.stock = req.body.stock;
  }
  try {
    const updatedBooks = await res.books.save();
    res.json(updatedBooks);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.delete('/:id', getBooks, async (req, res) => {
  try {
    await res.books.remove();
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

async function getBooks(req, res, next) {
  let books;
  try {
    books = await Books.findById(req.params.id);
    if (books == null) {
      return res.status(404).json({ message: 'Books not found' });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }

  res.books = books;
  next();
}

module.exports = router;
