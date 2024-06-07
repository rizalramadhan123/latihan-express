const mongoose = require('mongoose');

const sewaSchema = new mongoose.Schema({
  memberId: { type: mongoose.Schema.Types.ObjectId, ref: 'Member' },
  bookId: { type: mongoose.Schema.Types.ObjectId, ref: 'Book' },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
});

module.exports = mongoose.model('Sewa', sewaSchema);
