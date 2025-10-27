const express = require('express');
const router = express.Router();
const paymentService = require('../services/paymentService');

// Create Kaspi payment
router.post('/kaspi', async (req, res) => {
    try {
        const { order_id } = req.body;

        if (!order_id) {
            return res.status(400).json({
                success: false,
                error: 'Order ID is required'
            });
        }

        const payment = await paymentService.createKaspiPayment(order_id);

        res.json({
            success: true,
            data: payment
        });
    } catch (error) {
        console.error('Create Kaspi payment error:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// Webhook для подтверждения платежа от Kaspi
router.post('/webhook/kaspi', async (req, res) => {
    try {
        const { paymentId, status, transactionId } = req.body;

        console.log('Received Kaspi webhook:', { paymentId, status, transactionId });

        // В реальной реализации здесь должна быть проверка подписи вебхука

        const payment = await paymentService.updatePaymentStatus(
            paymentId, 
            status, 
            transactionId
        );

        res.json({
            success: true,
            message: 'Webhook processed successfully',
            data: payment
        });
    } catch (error) {
        console.error('Webhook processing error:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// Get payment status
router.get('/:id/status', async (req, res) => {
    try {
        const { data: payment, error } = await supabase
            .from('payments')
            .select(`
                *,
                orders (*)
            `)
            .eq('id', req.params.id)
            .single();

        if (error) throw error;

        res.json({
            success: true,
            data: {
                status: payment.status,
                amount: payment.amount,
                order_status: payment.orders.status,
                created_at: payment.created_at
            }
        });
    } catch (error) {
        console.error('Get payment status error:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// Simulate payment completion (для тестирования)
router.post('/:id/simulate-success', async (req, res) => {
    try {
        const payment = await paymentService.updatePaymentStatus(
            req.params.id,
            'completed',
            
        );

        res.json({
            success: true,
            message: 'Payment simulated successfully',
            data: payment
        });
    } catch (error) {
        console.error('Simulate payment error:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

module.exports = router;
