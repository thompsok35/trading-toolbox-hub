import dotenv from 'dotenv';
dotenv.config();

export const config = {
  get port() { return process.env.PORT || 3000; },
  get databaseUrl() { return process.env.DATABASE_URL; },
  get useMockDb() { return process.env.MOCK_DB === 'true'; },
  set useMockDb(val) { process.env.MOCK_DB = val ? 'true' : 'false'; },
  get resendApiKey() { return process.env.RESEND_API_KEY; },
  get adminPassword() { return process.env.ADMIN_PASSWORD; },
  get adminEmail() { return process.env.ADMIN_EMAIL || 'keith.thompson@mytradingtoolbox.com'; },
  get welcomeSender() { return process.env.WELCOME_EMAIL_SENDER || 'hello@mytradingtoolbox.com'; },
  get defaultMeetUrl() { return process.env.GOOGLE_MEET_URL || 'https://meet.google.com/new'; },
  get defaultAppUrl() { return process.env.APP_URL || 'https://mytradingtoolbox.com'; }
};

export default config;
