import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';
import { query } from '@/lib/db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const session = await getServerSession(req, res, authOptions);
    if (!session) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    if (req.method === 'GET') {
        try {
            const result = await query('SELECT * FROM orders ORDER BY created_at DESC');
            res.status(200).json(result.rows);
        } catch (error) {
            res.status(500).json({ error: 'Error fetching orders' });
        }
    } else if (req.method === 'POST') {
        const { orderId, status, message } = req.body;
        try {
            await query('UPDATE orders SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2', [status, orderId,]);
            await query(`INSERT INTO order_statuses (order_id, status, message) VALUES ($1, $2, $3)`, [orderId, status, message]);
            res.status(200).json({ success: true });
        } catch (error) {
            res.status(500).json({ error: 'Error updating order' });
        }
    } else {
        res.status(405).json({ error: 'Method not allowed' });
    }
}