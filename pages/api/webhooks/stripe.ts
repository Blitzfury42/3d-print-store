import type { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';
import { query } from '@/lib/db';
import { sendQuoteEmail } from '@/lib/email';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        const sig = req.headers['stripe-signature'];
        try {
            const event = stripe.webhooks.constructEvent(req.body, sig as string, endpointSecret);

            if (event.type === 'payment_intent.succeeded') {
                const paymentIntent = event.data.object as any;

                await query('UPDATE orders SET status = $1 WHERE stripe_payment_id = $2', ['Paiement confirmé', paymentIntent.id]);
                const orderResult = await query('SELECT * FROM orders WHERE stripe_payment_id = $1', [paymentIntent.id]);
                const order = orderResult.rows[0];

                await query(`INSERT INTO order_statuses (order_id, status, message) VALUES ($1, $2, $3)`, [order.id, 'Paiement confirmé', 'Paiement reçu avec succès']);
                await sendQuoteEmail(order);
            }
            res.status(200).json({ received: true });
        } catch (error) {
            console.error('Webhook error:', error);
            res.status(400).send(`Webhook Error: ${error}`);
        }
    } else {
        res.status(405).json({ error: 'Method not allowed' });
    }
}