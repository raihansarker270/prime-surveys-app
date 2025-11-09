import express from 'express';
import { protect, admin } from '../middleware/auth.js';
import { pool } from '../db.js';

const router = express.Router();

// All routes in this file are protected and require admin access
router.use(protect, admin);

// --- User Management ---

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private/Admin
router.get('/users', async (req, res) => {
    try {
        const result = await pool.query("SELECT id, name, email, balance, role FROM users WHERE role = 'user' ORDER BY created_at DESC");
        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// @desc    Update a user
// @route   PUT /api/admin/users/:id
// @access  Private/Admin
router.put('/users/:id', async (req, res) => {
    const { id } = req.params;
    const { name, balance } = req.body;
    try {
        const result = await pool.query(
            'UPDATE users SET name = $1, balance = $2 WHERE id = $3 RETURNING id, name, email, balance, role',
            [name, balance, id]
        );
        res.json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// @desc    Delete a user
// @route   DELETE /api/admin/users/:id
// @access  Private/Admin
router.delete('/users/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await pool.query('DELETE FROM users WHERE id = $1', [id]);
        res.json({ message: 'User removed' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// --- Withdrawal Management ---

// @desc    Get all withdrawals
// @route   GET /api/admin/withdrawals
// @access  Private/Admin
router.get('/withdrawals', async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT w.id, w.user_id, w.option_name, w.amount, w.status, w.created_at as date, u.name as "userName", u.email
            FROM withdrawals w
            JOIN users u ON w.user_id = u.id
            ORDER BY w.created_at DESC
        `);
        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// @desc    Update a withdrawal status
// @route   PUT /api/admin/withdrawals/:id
// @access  Private/Admin
router.put('/withdrawals/:id', async (req, res) => {
    const { id } = req.params;
    const { status, userId } = req.body;

    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        const withdrawalRes = await client.query('SELECT * FROM withdrawals WHERE id = $1', [id]);
        const withdrawal = withdrawalRes.rows[0];

        if (!withdrawal) {
            await client.query('ROLLBACK');
            return res.status(404).json({ message: 'Withdrawal not found' });
        }
        
        if (withdrawal.status !== 'Pending') {
            await client.query('ROLLBACK');
            return res.status(400).json({ message: 'Can only update pending withdrawals.' });
        }

        const updatedWithdrawal = await client.query(
            'UPDATE withdrawals SET status = $1 WHERE id = $2 RETURNING *',
            [status, id]
        );
        
        // If request is rejected ('Failed'), refund the user
        if (status === 'Failed') {
            await client.query('UPDATE users SET balance = balance + $1 WHERE id = $2', [withdrawal.amount, userId]);
        }

        await client.query('COMMIT');
        res.json(updatedWithdrawal.rows[0]);

    } catch (error) {
        await client.query('ROLLBACK');
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    } finally {
        client.release();
    }
});

export default router;
