import type { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';
import { query } from '@/lib/db';
import { sendQuoteEmail } from '@/lib/email';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

interface OrderData {
    modelUrl: string;
    color: string;
    quantity: number;
    specifications: string;
    customerEmail: string;
    customerName: string;
    totalPrice: number;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        try {
            const { modelUrl, color, quantity, specifications, customerEmail, customerName, }: OrderData = req.body;
            const totalPrice = quantity * 10;

            const paymentIntent = await stripe.paymentIntents.create({
                amount: Math.round(totalPrice * 100),
                currency: 'eur',
                metadata: {
                    modelUrl,
                    color,
                    quantity,
                    customerEmail,
                    customerName,
                },
            });

            const orderResult = await query(`INSERT INTO orders (model_url, color, quantity, specifications, customer_email, customer_name, total_price, stripe_payment_id, status) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`, [modelUrl, color, quantity, specifications, customerEmail, customerName, totalPrice, paymentIntent.id, 'En attente',]);
            const order = orderResult.rows[0];

            await query(`INSERT INTO order_statuses (order_id, status, message) VALUES ($1, $2, $3)`, [order.id, 'En attente', 'Commande en attente de paiement']);

            res.status(200).json({ clientSecret: paymentIntent.client_secret, orderId: order.id, });
        } catch (error) {
            console.error('Error creating order:', error);
            res.status(500).json({ error: 'Error creating order' });
        }
    } else {
        res.status(405).json({ error: 'Method not allowed' });
    }
}