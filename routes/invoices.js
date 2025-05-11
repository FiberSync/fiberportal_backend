const express = require('express');
const { getInvoiceByOrder, updatePaymentStatus, getAllInvoices,  updateInvoicePayment,
    updateInvoiceStatus,
    extendInvoiceDueDate } = require('../controllers/invoices');
const router = express.Router();



router.get('/getOne', getInvoiceByOrder);
router.get('/getAll', getAllInvoices);


router.put('/updatepaymentstatus', updatePaymentStatus);


router.post('/updatePayment', updateInvoicePayment);


router.post('/updateStatus', updateInvoiceStatus);


router.post('/extendDueDate', extendInvoiceDueDate);

module.exports = router;
