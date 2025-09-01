const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE, 
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

const sendResetEmail = async (to, resetToken) => {
  const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
  
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: to,
    subject: 'Parola Sıfırlama',
    html: `
      <h1>Parola Sıfırlama İsteği</h1>
      <p>Parolanızı sıfırlamak için aşağıdaki linke tıklayın:</p>
      <a href="${resetUrl}">Parolamı Sıfırla</a>
      <p>Bu link 1 saat süreyle geçerlidir.</p>
      <p>Eğer bu isteği siz yapmadıysanız, bu emaili görmezden gelin.</p>
    `
  };

  return transporter.sendMail(mailOptions);
};

module.exports = {
  sendResetEmail
};
