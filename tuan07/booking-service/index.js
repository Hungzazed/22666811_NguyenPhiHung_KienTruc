const express = require('express');
const cors = require('cors');
const { connectRabbitMQ, getChannel, EXCHANGE_NAME } = require('./rabbitmq');

const app = express();
const PORT = 8083;

app.use(cors());
app.use(express.json());

let bookings = [];
let idCounter = 1;

app.get('/bookings/:user', async (req, res) => {
    console.log(`[Booking Service] GET bookings for user: ${req.params.user}`);

    try {
        const userBookings = bookings
            .filter(b => b.user === req.params.user)
            .sort((a, b) => b.id - a.id);

        res.json(userBookings);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

app.post('/bookings', async (req, res) => {
    const { movieName, seatNumber, user } = req.body;
    console.log(`[Booking Service] POST new booking for user: ${user}`);

    try {
        const newBooking = {
            id: idCounter++,
            movieName,
            seatNumber,
            user,
            status: 'PENDING'
        };

        bookings.push(newBooking);

        const channel = getChannel();
        if (channel) {
            const event = {
                bookingId: newBooking.id,
                movieName,
                seatNumber,
                user,
                type: 'BOOKING_CREATED'
            };

            channel.publish(
                EXCHANGE_NAME,
                '',
                Buffer.from(JSON.stringify(event))
            );

            console.log(`[Booking Service] Event published: BOOKING_CREATED for ID: ${newBooking.id}`);
        }

        res.status(201).json({
            message: 'Booking pending',
            bookingId: newBooking.id
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

async function startConsumer() {
    await connectRabbitMQ();
    const channel = getChannel();

    const q = await channel.assertQueue('', { durable: true });
    await channel.bindQueue(q.queue, EXCHANGE_NAME, '');

    channel.consume(q.queue, async (msg) => {
        if (msg !== null) {
            const event = JSON.parse(msg.content.toString());

            if (event.type === 'PAYMENT_COMPLETED' || event.type === 'BOOKING_FAILED') {
                const newStatus =
                    event.type === 'PAYMENT_COMPLETED' ? 'SUCCESS' : 'FAILED';

                const booking = bookings.find(b => b.id === event.bookingId);
                if (booking) {
                    booking.status = newStatus;
                    console.log(
                        `[Booking Service] Booking ${event.bookingId} updated to ${newStatus}`
                    );
                }
            }
        }
    }, { noAck: true });
}

app.listen(PORT, () => {
    console.log(`[Booking Service] running on port ${PORT}`);
    startConsumer();
});