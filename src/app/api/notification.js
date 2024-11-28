export default async function handler(req, res) {
    if (req.method === 'POST') {
        try {
            const { message } = req.body;

            // Aquí podrías hacer un fetch al backend Flask
            const response = await fetch('http://localhost:5000/socketio/trigger_notification', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ message }),
            });

            if (!response.ok) {
                throw new Error('Error al enviar la notificación');
            }

            res.status(200).json({ success: true, message: 'Notificación enviada' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ success: false, message: 'Error al enviar la notificación' });
        }
    } else {
        // Responde con un error si el método no es POST
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Método ${req.method} no permitido`);
    }
}
