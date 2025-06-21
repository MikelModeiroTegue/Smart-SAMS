const express = require('express');
const router = express.Router();
const passport = require('../../logic/authLogic');
const authService = require('../../services/authService');

// Initiate Google OAuth
router.get('/google', passport.authenticate('google', {
  scope: ['profile', 'email'],
}));

// Google OAuth callback
router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/auth/failure" }),
  async (req, res) => {
    try {
      const user = await authService.processGoogleUser(req.user);

      console.log("User processed successfully:", user);
      // Use expo-auth-session compatible redirect
      const redirectUrl = new URL("https://auth.expo.io/@modeiro/smart-sams");
      redirectUrl.searchParams.append("user", JSON.stringify(user));

      // For iOS compatibility, we need to use a specific format
      return res.redirect(
        `exp://auth.expo.io/@modeiro/smart-sams?user=${encodeURIComponent(
          JSON.stringify(user)
        )}`
      );
    } catch (error) {
      return res.redirect(
        `exp://auth.expo.io/@modeiro/smart-sams?error=${encodeURIComponent(
          error.message
        )}`
      );
    }
  }
);

router.post('/register-student', async (req, res) => {
    try {
      const { matricule, email, name, phoneNum, department, deviceInfo } = req.body;
      if (!matricule || !email || !name || !phoneNum || !department) {
        return res.status(400).json({ error: 'Missing required fields' });
      }
      const validDepartments = [
        'Computer Engineering',
        'Electrical Engineering',
        'Civil Engineering',
        'Petroleum Engineering',
        'Mechanical Engineering',
      ];
      if (!validDepartments.includes(department)) {
        return res.status(400).json({ error: 'Invalid department' });
      }
      const user = await authService.registerStudent({
        matricule,
        email,
        name,
        phoneNum,
        department,
        deviceInfo,
      });
      res.status(200).json({ user });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });
  
  router.get('/failure', (req, res) => {
    res.status(401).json({ error: 'Authentication failed' });
  });


module.exports = router;