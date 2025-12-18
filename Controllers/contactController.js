const Contact = require("../Models/contactModel");

// 📌 Create Contact (Frontend → Backend)
exports.createContact = async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;

    console.log('📞 NEW CONTACT FORM SUBMISSION');
    console.log('📛 Name:', name);
    console.log('📧 Email:', email);
    console.log('📱 Phone:', phone);
    console.log('📝 Subject:', subject);

    if (!name || !email || !subject || !message) {
      console.log('❌ Contact form validation failed - Missing required fields');
      return res.status(400).json({ 
        success: false, 
        message: "Name, email, subject, and message are required" 
      });
    }

    const newContact = new Contact({
      name,
      email,
      phone,
      subject,
      message
    });

    console.log('💾 Saving contact to database...');
    const savedContact = await newContact.save();
    console.log('✅ Contact saved successfully with ID:', savedContact._id);

    res.status(201).json({
      success: true,
      message: "Contact submitted successfully",
      data: savedContact
    });

  } catch (error) {
    console.log('❌ Contact submission failed:', error.message);
    res.status(500).json({
      success: false,
      message: "Failed to submit contact",
      error: error.message
    });
  }
};

// 📌 Get All Contacts (Admin)
exports.getAllContacts = async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: contacts });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch contacts",
      error: error.message
    });
  }
};

// 📌 Delete Contact (Admin)
exports.deleteContact = async (req, res) => {
  try {
    const { id } = req.params;

    await Contact.findByIdAndDelete(id);

    res.status(200).json({
      message: "Contact deleted successfully"
    });
  } catch (error) {
    res.status(500).json({
      message: "Delete failed",
      error: error.message
    });
  }
};