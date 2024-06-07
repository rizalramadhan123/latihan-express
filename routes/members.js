const express = require('express');
const router = express.Router();
const Members = require('../models/Members');

/**
 * @swagger
 * components:
 *   schemas:
 *     Members:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: ID otomatis yang dihasilkan
 *         code:
 *           type: string
 *           description: Kode members
 *         name:
 *           type: string
 *           description: Nama members
 *         pinalty:
 *           type: string
 *           description: Pinalty
 *       example:
 *         id: 60d5ec49a1d3c72bdc4d5678
 *         code: M001
 *         name: Angga
 *         pinalty: f
 */

/**
 * @swagger
 * /members:
 *   get:
 *     summary: Retrieve all members
 *     responses:
 *       200:
 *         description: A list of members
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Members'
 *   post:
 *     summary: Create a new members
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Members'
 *     responses:
 *       201:
 *         description: Members created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Members'
 */
router.get('/', async (req, res) => {
  try {
    const members = await Members.find();
    res.json(members);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/', async (req, res) => {
  const members = new Members({
    code: req.body.code,
    name: req.body.name,
    pinalty: req.body.pinalty,
  });
  try {
    const newMembers = await members.save();
    res.status(201).json(newMembers);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

/**
 * @swagger
 * /members/{id}:
 *   get:
 *     summary: Untuk Mendapatkan Member Id
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the members to get
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Members found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Members'
 *       404:
 *         description: Members not found
 *   put:
 *     summary: Update a members by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the members to update
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Members'
 *     responses:
 *       200:
 *         description: Members updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Members'
 *       404:
 *         description: Members not found
 *   delete:
 *     summary: Delete a members by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the members to delete
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Members deleted successfully
 *       404:
 *         description: Members not found
 */
router.get('/:id', getMembers, (req, res) => {
  res.json(res.members);
});

router.put('/:id', getMembers, async (req, res) => {
  if (req.body.code != null) {
    res.members.code = req.body.code;
  }
  if (req.body.name != null) {
    res.members.name = req.body.name;
  }
  if (req.body.pinalty != null) {
    res.members.pinalty = req.body.pinalty;
  }
  
  try {
    const updatedMembers = await res.members.save();
    res.json(updatedMembers);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.delete('/:id', getMembers, async (req, res) => {
  try {
    await res.members.remove();
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

async function getMembers(req, res, next) {
  let members;
  try {
    members = await Members.findById(req.params.id);
    if (members == null) {
      return res.status(404).json({ message: 'Members not found' });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }

  res.members = members;
  next();
}

module.exports = router;
