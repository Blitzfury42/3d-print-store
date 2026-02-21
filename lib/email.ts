import { Resend } from '@resend/resend';
const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendQuoteEmail(order: any) {
    try {
        await resend.emails.send({
            from: 'noreply@3dprintstore.com',
            to: order.customer_email,
            subject: `Votre devis - Commande #${order.id}`,
            html: `<h1>Merci pour votre commande!</h1><p>Bonjour ${order.customer_name},</p><p>Voici le détail de votre commande :</p><ul><li><strong>Numéro de commande :</strong> #${order.id}</li><li><strong>Lien du modèle :</strong> <a href="${order.model_url}">${order.model_url}</a></li><li><strong>Couleur :</strong> ${order.color}</li><li><strong>Quantité :</strong> ${order.quantity}</li><li><strong>Spécifications :</strong> ${order.specifications || 'Aucune'}</li><li><strong>Prix total :</strong> ${order.total_price}€</li></ul><p>Nous commencerons la production de votre modèle 3D dès que possible.</p><p>Cordialement,<br>L'équipe 3D Print Store</p>`,
        });
    } catch (error) {
        console.error('Error sending email:', error);
    }
}

export async function sendStatusUpdateEmail(order: any, newStatus: string) {
    const statusMessages: any = {
        'En production': 'Votre modèle est maintenant en production.',
        'Prêt': 'Votre modèle est prêt ! Nous vous envoyons un lien de collecte.',
        'Livré': 'Votre modèle a été livré avec succès.',
    };
    try {
        await resend.emails.send({
            from: 'noreply@3dprintstore.com',
            to: order.customer_email,
            subject: `Mise à jour de votre commande #${order.id}`,
            html: `<h1>Mise à jour de votre commande</h1><p>Bonjour ${order.customer_name},</p><p>${statusMessages[newStatus] || 'Votre commande a été mise à jour.'}</p><p><strong>Numéro de commande :</strong> #${order.id}</p><p><strong>Nouveau statut :</strong> ${newStatus}</p><p>Merci de votre confiance!<br>L'équipe 3D Print Store</p>`,
        });
    } catch (error) {
        console.error('Error sending status email:', error);
    }
}