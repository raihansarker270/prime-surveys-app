import express from 'express';
import { protect } from '../middleware/auth.js';
import { pool } from '../db.js';

const router = express.Router();

// @desc    Get user profile
// @route   GET /api/users/me
// @access  Private
router.get('/me', protect, async (req, res) => {
    // req.user is populated by the 'protect' middleware
    const userProfile = { ...req.user };
    
    // Fetch withdrawal history and attach it to the user profile
    try {
        const withdrawalsResult = await pool.query('SELECT id, option_name, amount, status, created_at as date FROM withdrawals WHERE user_id = $1 ORDER BY created_at DESC', [req.user.id]);
        userProfile.withdrawalHistory = withdrawalsResult.rows;
        res.json(userProfile);
    } catch (error) {
        console.error('Failed to fetch withdrawal history', error);
        res.status(500).json({ message: "Could not fetch user profile details." });
    }
});

export default router;
