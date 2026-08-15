import { config } from '../config/env.js';

export const adminAuth = (req, res, next) => {
  const adminPassword = process.env.ADMIN_PASSWORD || config.adminPassword;
  const providedPassword = req.headers['x-admin-password'];
  const apiKey = req.headers['x-api-key'];
  const expectedApiKey = process.env.HUB_API_KEY;

  // Support both Admin Password and microservice API Keys
  if ((adminPassword && providedPassword === adminPassword) || (expectedApiKey && apiKey === expectedApiKey)) {
    return next();
  }

  return res.status(401).json({ 
    success: false, 
    error: 'Unauthorized: Valid admin credentials or API key required' 
  });
};
