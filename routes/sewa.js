const express = require('express');
const router = express.Router();
const Sewa = require('../models/Sewa');
const Member = require('../models/Members');
const Book = require('../models/Books');

/**
 * @swagger
 * components:
 *   schemas:
 *     Sewa:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: ID otomatis yang dihasilkan
 *         memberId:
 *           type: string
 *           description: ID member yang meminjam
 *         bookId:
 *           type: string
 *           description: ID buku yang dipinjam
 *         startDate:
 *           type: string
 *           format: date
 *           description: Tanggal mulai peminjaman
 *         endDate:
 *           type: string
 *           format: date
 *           description: Tanggal akhir peminjaman
 *       example:
 *         id: 60d5ec49a1d3c72bdc4d5678
 *         memberId: 60d5ec49a1d3c72bdc4d5671
 *         bookId: 60d5ec49a1d3c72bdc4d5672
 *         startDate: 2023-06-01
 *         endDate: 2023-06-15
 */

/**
 * @swagger
 * /sewa:
 *   get:
 *     summary: Retrieve all sewa records
 *     responses:
 *       200:
 *         description: A list of sewa records
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Sewa'
 *   post:
 *     summary: Create a new sewa record
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Sewa'
 *     responses:
 *       201:
 *         description: Sewa record created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Sewa'
 */
router.get('/', async (req, res) => {
  try {
    const sewa = await Sewa.find().populate('memberId').populate('bookId');
    res.json(sewa);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/', async (req, res) => {
  const { memberId, bookId, startDate, endDate } = req.body;
  
  try {
    // Validasi member dan book ID
    const member = await Member.findById(memberId);
    const book = await Book.findById(bookId);
    if (!member || !book) {
      return res.status(404).json({ message: 'Member atau Book tidak ditemukan' });
    }

    // Cek jumlah buku yang sudah disewa oleh member
    const sewaCount = await Sewa.countDocuments({ memberId });
    if (sewaCount >= 2) {
      return res.status(400).json({ message: 'Member sudah menyewa 2 buku' });
    }

    const sewa = new Sewa({
      memberId,
      bookId,
      startDate,
      endDate,
    });
    const newSewa = await sewa.save();
    res.status(201).json(newSewa);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/**
 * @swagger
 * /sewa/{id}:
 *   get:
 *     summary: Get a sewa record by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the sewa record to get
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Sewa record found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Sewa'
 *       404:
 *         description: Sewa record not found
 *   put:
 *     summary: Update a sewa record by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the sewa record to update
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Sewa'
 *     responses:
 *       200:
 *         description: Sewa record updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Sewa'
 *       404:
 *         description: Sewa record not found
 *   delete:
 *     summary: Delete a sewa record by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the sewa record to delete
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Sewa record deleted successfully
 *       404:
 *         description: Sewa record not found
 */
router.get('/:id', getSewa, (req, res) => {
  res.json(res.sewa);
});

router.put('/:id', getSewa, async (req, res) => {
  const { memberId, bookId, startDate, endDate } = req.body;

  if (memberId != null) {
    res.sewa.memberId = memberId;
  }
  if (bookId != null) {
    res.sewa.bookId = bookId;
  }
  if (startDate != null) {
    res.sewa.startDate = startDate;
  }
  if (endDate != null) {
    res.sewa.endDate = endDate;
  }
  try {
    const updatedSewa = await res.sewa.save();
    res.json(updatedSewa);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.delete('/:id', getSewa, async (req, res) => {
  try {
    await res.sewa.remove();

    // Cek apakah pengembalian terlambat
    const currentDate = new Date();
    const endDate = new Date(res.sewa.endDate);
    const diffTime = Math.abs(currentDate - endDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays > 7) {
      // Menetapkan penalti pada member
      await Member.findByIdAndUpdate(res.sewa.memberId, { penalty: 't' });
    }

    res.status(204).send();
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

async function getSewa(req, res, next) {
  let sewa;
  try {
    sewa = await Sewa.findById(req.params.id).populate('memberId').populate('bookId');
    if (sewa == null) {
      return res.status(404).json({ message: 'Sewa record not found' });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }

  res.sewa = sewa;
  next();
}

module.exports = router;
