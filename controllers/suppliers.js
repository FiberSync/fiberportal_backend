const Supplier = require('../models/supplier');

// Create a new supplier
const createSupplier = async (req, res) => {
  try {
    const info = {
      name: req.body.name,
      city: req.body.city,
      country: req.body.country,
      phoneNumber: req.body.phoneNumber,
      email: req.body.email,
      description: req.body.description,
      imageUrl: req.body.imageUrl,
      walletAddress: req.body.walletAddress,
      companyName: req.body.companyName,
      }
    const newSupplier = new Supplier(info);
    const savedSupplier = await newSupplier.save();
    res.status(201).json(savedSupplier);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get all suppliers
// const getAllSuppliers = async (req, res) => {
//   try {
//     const suppliers = await Supplier.find();
//     res.json(suppliers);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };
const getAllSuppliers = async (req, res) => {

  try {
    const walletAddress = req.query.walletAddress;
    const companyName = req.query.companyName;
    const suppliers = await Supplier.find({   walletAddress: walletAddress, companyName: companyName });

    res.json(suppliers);
  } catch (error) { 
    res.status(500).json({ message: error.message });
  }
};

// Delete supplier by id 




// Delete supplier by id
const deleteSupplier = async (req, res) => {
  try {
    const supplier = await Supplier.findByIdAndDelete(req.params.id);
    if (!supplier) {
      return res.status(404).json({ message: 'Supplier not found' });
    }
    res.json({ message: 'Supplier deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update supplier by id
const updateSupplier = async (req, res) => {
  try {
    const supplier = await Supplier.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!supplier) {
      return res.status(404).json({ message: 'Supplier not found' });
    }
    res.json(supplier);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
    createSupplier,
    getAllSuppliers,
    deleteSupplier,
    updateSupplier
}






// -----------------------------------------------


// Dummy data for testing
const dummySupplierData = [
  {
    name: 'Supplier A',
    city: 'New York',
    country: 'USA',
    phoneNumber: '+1-123-456-7890',
    email: 'supplierA@example.com',
    description: 'A leading supplier in the US.',
    imageUrl: 'https://example.com/supplierA.jpg',
    productsOffered: ['Product 1', 'Product 2'],
    leadTime: '2-3 weeks',
    minimumOrderQuantity: 100,
    paymentTerms: 'Net 30',
    qualityCertifications: ['ISO 9001'],
  },
  {
    name: 'Supplier B',
    city: 'London',
    country: 'UK',
    phoneNumber: '+44-20-1234-5678',
    email: 'supplierB@example.com',
    description: 'A reliable supplier based in the UK.',
    imageUrl: 'https://example.com/supplierB.jpg',
    productsOffered: ['Product 3', 'Product 4'],
    leadTime: '1-2 weeks',
    minimumOrderQuantity: 50,
    paymentTerms: 'Net 60',
    qualityCertifications: ['ISO 14001'],
  },
  {
    name: 'Supplier C',
    city: 'Tokyo',
    country: 'Japan',
    phoneNumber: '+81-3-1234-5678',
    email: 'supplierC@example.com',
    description: 'A high-quality supplier from Japan.',
    imageUrl: 'https://example.com/supplierC.jpg',
    productsOffered: ['Product 5', 'Product 6'],
    leadTime: '3-4 weeks',
    minimumOrderQuantity: 200,
    paymentTerms: 'Net 45',
    qualityCertifications: ['JIS'],
  },
];
