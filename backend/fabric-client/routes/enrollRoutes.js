const express = require('express');
const router = express.Router();
const { enrollUser } = require('../controllers/enrollController');

// Swagger documentation
/**
 * @swagger
 * /api/enroll:
 *   post:
 *     summary: Enroll a new user to the Fabric CA
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               enrollmentID:
 *                 type: string
 *               role:
 *                 type: string
 *     responses:
 *       200:
 *         description: User enrolled successfully
 *       400:
 *         description: Bad request
 */

router.post('/', enrollUser);
module.exports = router;
