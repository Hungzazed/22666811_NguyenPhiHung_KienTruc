const express = require('express');
const { connectRabbitMQ, getChannel, EXCHANGE_NAME } = require('./rabbitmq');

const app = express();
const PORT = 8084;

app.get('/health', (req, res) => res.send('OK'));

async function startService() {
    await connectRabbitMQ();
    const channel = getChannel();

    if (!channel) return;

    // Tạo một hàng đợi tạm thời (exclusive) cho service này
    const q = await channel.assertQueue(EXCHANGE_NAME, { durable: true });
    // Kết nối hàng đợi này vào Exchange
    await channel.bindQueue(q.queue, EXCHANGE_NAME, '');

    channel.consume(q.queue, (msg) => {
        if (msg !== null) {
            const event = JSON.parse(msg.content.toString());
            
            // 1. Payment Logic
            if (event.type === 'BOOKING_CREATED') {
                const bookingId = event.bookingId;
                console.log(`[Payment Service] Processing Payment for Booking ID: ${bookingId}`);
                
                const isSuccess = Math.random() > 0.3; 
                let resultEvent;
                if (isSuccess) {
                    resultEvent = { type: "PAYMENT_COMPLETED", bookingId };
                    console.log(`[Payment Service] Result: SUCCESS for ID: ${bookingId}`);
                } else {
                    resultEvent = { type: "BOOKING_FAILED", bookingId };
                    console.log(`[Payment Service] Result: FAILED for ID: ${bookingId}`);
                }
                
                // Publish kết quả lên Exchange
                channel.publish(EXCHANGE_NAME, '', Buffer.from(JSON.stringify(resultEvent)), { persistent:true });
            }

            // 2. Notification Logic
            if (event.type === 'PAYMENT_COMPLETED') {
                console.log(`[Notification Service] 🔔 THÀNH CÔNG: Vé #${event.bookingId} đã thanh toán!`);
            } else if (event.type === 'BOOKING_FAILED') {
                console.log(`[Notification Service] ❌ THẤT BẠI: Vé #${event.bookingId} bị từ chối!`);
            } else if (event.type === 'USER_REGISTERED') {
                console.log(`[Notification Service] 👤 CHÀO MỪNG: ${event.username} đã gia nhập hệ thống!`);
            }
        }
    }, { noAck: true });
}

app.listen(PORT, () => {
    console.log(`[Payment+Notification Service] running on port ${PORT}`);
    startService();
});
