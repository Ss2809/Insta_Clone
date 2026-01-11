const nodemailer = require("nodemailer")

const Transport = nodemailer.createTransport(
  {
    host : process.env.Host_key,
    port : process.env.nodemailer_port,
    secure : true,
    auth : {
       user : process.env.SMTP_USER,
       pass : process.env.SMTP_PASS,
    }
  }
) 

const sendSMTPEmail = async(to,subject,text)=>{
  try {
    const mailOptions= {
      from : process.env.SMTP_USER,
      to,
      subject,
      text
    }
    await Transport.sendMail(mailOptions);
    console.log("mail send succfully !!")
  } catch (error) {
    console.log("Errror occures mail send time", error.message)
  }
}

module.exports= sendSMTPEmail