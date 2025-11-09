import express from 'express';
import { protect } from '../middleware/auth.js';
import { pool } from '../db.js';

const router = express.Router();

// @desc    Create a new withdrawal request
// @route   POST /api/withdrawals
// @access  Private
router.post('/', protect, async (req, res) => {
    const { optionName, amount } = req.body; // amount is in cents
    const userId = req.user.id;
    const userBalance = req.user.balance;

    if (!optionName || !amount) {
        return res.status(400).json({ message: 'Please provide all fields' });
    }

    if (amount <= 0 || !Number.isInteger(amount)) {
        return res.status(400).json({ message: 'Invalid withdrawal amount' });
    }
    
    if (amount > userBalance) {
        return res.status(400).json({ message: 'Insufficient balance' });
    }
    
    const client = await pool.connect();
    try {
        await client.query('BEGIN'); // Start transaction

        // Deduct balance from user
        const newBalance = userBalance - amount;
        await client.query('UPDATE users SET balance = $1 WHERE id = $2', [newBalance, userId]);

        // Create withdrawal record
        const newWithdrawal = await client.query(
            'INSERT INTO withdrawals (user_id, option_name, amount) VALUES ($1, $2, $3) RETURNING *',
            [userId, optionName, amount]
        );
        
        await client.query('COMMIT'); // Commit transaction

        res.status(201).json(newWithdrawal.rows[0]);

    } catch (error) {
        await client.query('ROLLBACK'); // Rollback transaction on error
        console.error(error);
        res.status(500).json({ message: 'Server error while creating withdrawal request' });
    } finally {
        client.release();
    }
});


export default router;
