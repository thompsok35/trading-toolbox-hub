import dotenv from 'dotenv';
dotenv.config();

export const config = {
  port: process.env.PORT || 3000,
  databaseUrl: process.env.DATABASE_URL,
  useMockDb: process.env.MOCK_DB === 'true',
  resendApiKey: process.env.RESEND_API_KEY,
  adminPassword: process.env.ADMIN_PASSWORD,
  adminEmail: process.env.ADMIN_EMAIL || 'keith.thompson@mytradingtoolbox.com',
  welcomeSender: process.env.WELCOME_EMAIL_SENDER || 'hello@mytradingtoolbox.com',
  defaultMeetUrl: process.env.GOOGLE_MEET_URL || 'https://meet.google.com/new',
  defaultAppUrl: process.env.APP_URL || 'https://mytradingtoolbox.com'
};

export default config;
