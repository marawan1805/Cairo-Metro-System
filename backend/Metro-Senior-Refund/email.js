import sgMail from '@sendgrid/mail';
import dotenv from "dotenv";
dotenv.config();

sgMail.setApiKey(process.env.SENDGRID_API_KEY);


const sendEmail = (email, refundRequestId, status, totalPrice) => {
  return sgMail.send({
      to: email,
      from: 'giurabbitmart@gmail.com',
      subject: `Refund Request ${status}`,
      text: `Your refund request has been ${status}.\nRefund Request Id:  ${refundRequestId}\nTotal Price: ${totalPrice}`
    });
}

export default{
  sendEmail
}