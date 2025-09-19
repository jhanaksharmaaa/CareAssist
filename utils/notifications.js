const nodemailer = require('nodemailer');

// Create transporter
const transporter = nodemailer.createTransporter({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendMedicationReminder = async (patient, medication) => {
  try {
    // In a real implementation, this would send an email or push notification
    console.log(`Medication reminder for ${patient.name}: ${medication.name}`);
    
    // Example email sending (commented out for now)
    /*
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: patient.email,
      subject: `Medication Reminder: ${medication.name}`,
      html: `<p>Hello ${patient.name},</p>
             <p>This is a reminder to take your medication: ${medication.name}</p>
             <p>Dosage: ${medication.dosage.value} ${medication.dosage.unit}</p>
             <p>Thank you,<br>CareAssist Team</p>`
    };
    
    await transporter.sendMail(mailOptions);
    */
    
    return true;
  } catch (error) {
    console.error('Error sending medication reminder:', error);
    return false;
  }
};

const sendCriticalAlert = async (patient, reading, healthcareProfessionals) => {
  try {
    console.log(`Critical alert for ${patient.name}: ${reading.type} reading is ${reading.status}`);
    
    // In a real implementation, this would notify healthcare professionals
    /*
    for (const professional of healthcareProfessionals) {
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: professional.email,
        subject: `CRITICAL: ${patient.name} has a ${reading.status} reading`,
        html: `<p>Hello Dr. ${professional.name},</p>
               <p>Your patient ${patient.name} has a critical reading:</p>
               <p>Type: ${reading.type}</p>
               <p>Value: ${JSON.stringify(reading.value)}</p>
               <p>Please take appropriate action.</p>`
      };
      
      await transporter.sendMail(mailOptions);
    }
    */
    
    return true;
  } catch (error) {
    console.error('Error sending critical alert:', error);
    return false;
  }
};

module.exports = { sendMedicationReminder, sendCriticalAlert };