import nodemailer from 'nodemailer';

// Email templates
const templates = {
  bookingConfirmation: (guestName: string, lodgingTitle: string, checkIn: string, checkOut: string, totalPrice: number) => ({
    subject: 'Booking Confirmation - Smart Lodging',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Booking Confirmed!</h2>
        <p>Hi ${guestName},</p>
        <p>Your booking has been confirmed. Here are the details:</p>
        <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p><strong>Lodging:</strong> ${lodgingTitle}</p>
          <p><strong>Check-in:</strong> ${checkIn}</p>
          <p><strong>Check-out:</strong> ${checkOut}</p>
          <p><strong>Total Price:</strong> K${totalPrice}</p>
          <p><strong>Payment Status:</strong> Pending (Cash payment at check-in)</p>
        </div>
        <p>Please arrive on time and bring valid ID. If you have any questions, please contact us.</p>
        <p>Best regards,<br/>Smart Lodging Team</p>
      </div>
    `
  }),

  bookingCancelled: (guestName: string, lodgingTitle: string, refundAmount: number) => ({
    subject: 'Booking Cancelled - Smart Lodging',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #d32f2f;">Booking Cancelled</h2>
        <p>Hi ${guestName},</p>
        <p>Your booking for ${lodgingTitle} has been cancelled.</p>
        <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p><strong>Refund Amount:</strong> K${refundAmount}</p>
          <p><strong>Status:</strong> Refund processed</p>
        </div>
        <p>If you have any questions, please contact us.</p>
        <p>Best regards,<br/>Smart Lodging Team</p>
      </div>
    `
  }),

  hostBookingNotification: (hostName: string, guestName: string, lodgingTitle: string, checkIn: string, checkOut: string, numberOfGuests: number, totalPrice: number) => ({
    subject: 'New Booking - Smart Lodging',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">New Booking Received!</h2>
        <p>Hi ${hostName},</p>
        <p>You have a new booking. Here are the details:</p>
        <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p><strong>Guest:</strong> ${guestName}</p>
          <p><strong>Lodging:</strong> ${lodgingTitle}</p>
          <p><strong>Check-in:</strong> ${checkIn}</p>
          <p><strong>Check-out:</strong> ${checkOut}</p>
          <p><strong>Guests:</strong> ${numberOfGuests}</p>
          <p><strong>Total Price:</strong> K${totalPrice}</p>
        </div>
        <p>Please log in to your dashboard to confirm or reject this booking.</p>
        <p>Best regards,<br/>Smart Lodging Team</p>
      </div>
    `
  }),

  paymentRecorded: (hostName: string, guestName: string, amount: number, lodgingTitle: string) => ({
    subject: 'Payment Recorded - Smart Lodging',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #4caf50;">Payment Recorded</h2>
        <p>Hi ${hostName},</p>
        <p>A cash payment has been recorded for your booking.</p>
        <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p><strong>Guest:</strong> ${guestName}</p>
          <p><strong>Lodging:</strong> ${lodgingTitle}</p>
          <p><strong>Amount:</strong> K${amount}</p>
          <p><strong>Status:</strong> Payment Received</p>
        </div>
        <p>The payment has been added to your earnings. You can view your payment history in your dashboard.</p>
        <p>Best regards,<br/>Smart Lodging Team</p>
      </div>
    `
  }),
};

// Create transporter
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

// Email service
export const emailService = {
  // Send booking confirmation to guest
  sendBookingConfirmation: async (
    guestEmail: string,
    guestName: string,
    lodgingTitle: string,
    checkIn: string,
    checkOut: string,
    totalPrice: number
  ) => {
    try {
      const template = templates.bookingConfirmation(guestName, lodgingTitle, checkIn, checkOut, totalPrice);
      await transporter.sendMail({
        from: process.env.SMTP_USER || 'noreply@smartlodging.com',
        to: guestEmail,
        ...template,
      });
      console.log(`Booking confirmation sent to ${guestEmail}`);
    } catch (error) {
      console.error('Failed to send booking confirmation:', error);
      // Don't throw - booking should be created even if email fails
    }
  },

  // Send booking cancellation to guest
  sendBookingCancellation: async (
    guestEmail: string,
    guestName: string,
    lodgingTitle: string,
    refundAmount: number
  ) => {
    try {
      const template = templates.bookingCancelled(guestName, lodgingTitle, refundAmount);
      await transporter.sendMail({
        from: process.env.SMTP_USER || 'noreply@smartlodging.com',
        to: guestEmail,
        ...template,
      });
      console.log(`Booking cancellation sent to ${guestEmail}`);
    } catch (error) {
      console.error('Failed to send booking cancellation:', error);
    }
  },

  // Send notification to host about new booking
  sendHostBookingNotification: async (
    hostEmail: string,
    hostName: string,
    guestName: string,
    lodgingTitle: string,
    checkIn: string,
    checkOut: string,
    numberOfGuests: number,
    totalPrice: number
  ) => {
    try {
      const template = templates.hostBookingNotification(hostName, guestName, lodgingTitle, checkIn, checkOut, numberOfGuests, totalPrice);
      await transporter.sendMail({
        from: process.env.SMTP_USER || 'noreply@smartlodging.com',
        to: hostEmail,
        ...template,
      });
      console.log(`Host notification sent to ${hostEmail}`);
    } catch (error) {
      console.error('Failed to send host notification:', error);
    }
  },

  // Send payment recorded notification
  sendPaymentNotification: async (
    hostEmail: string,
    hostName: string,
    guestName: string,
    amount: number,
    lodgingTitle: string
  ) => {
    try {
      const template = templates.paymentRecorded(hostName, guestName, amount, lodgingTitle);
      await transporter.sendMail({
        from: process.env.SMTP_USER || 'noreply@smartlodging.com',
        to: hostEmail,
        ...template,
      });
      console.log(`Payment notification sent to ${hostEmail}`);
    } catch (error) {
      console.error('Failed to send payment notification:', error);
    }
  },

  // Test email connection
  testConnection: async () => {
    try {
      await transporter.verify();
      console.log('✓ Email service connected and ready');
      return true;
    } catch (error) {
      console.warn('⚠ Email service not configured - emails will not be sent');
      return false;
    }
  },
};
