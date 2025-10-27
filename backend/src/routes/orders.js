const express = require('express');
const router = express.Router();
const paymentService = require('../services/paymentService');

// Create new order
router.post('/', async (req, res) => {
    try {
        const { tariff_id, customer_name, customer_email, customer_phone, address } = req.body;

        if (!tariff_id || !customer_name || !customer_email) {
            return res.status(400).json({
                error: 'Missing required fields: tariff_id, customer_name, customer_email'
            });
        }

        const order = await paymentService.createOrder({
            tariff_id,
            customer_name,
            customer_email,
            customer_phone,
            address
        });

        res.status(201).json({
            success: true,
            data: order
        });
    } catch (error) {
        console.error('Create order error:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// Get order by ID
router.get('/:id', async (req, res) => {
    try {
        const order = await paymentService.getOrderWithPayments(req.params.id);
        
        res.json({
            success: true,
            data: order
        });
    } catch (error) {
        console.error('Get order error:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// Get all orders (для админки)
router.get('/', async (req, res) => {
    try {
        const { page = 1, limit = 10, status } = req.query;
        const from = (page - 1) * limit;

        let query = supabase
            .from('orders')
            .select(`
                *,
                tariffs (*),
                payments (*)
            `, { count: 'exact' })
            .order('created_at', { ascending: false })
            .range(from, from + limit - 1);

        if (status) {
            query = query.eq('status', status);
        }

        const { data, error, count } = await query;

        if (error) throw error;

        res.json({
            success: true,
            data,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total: count,
                pages: Math.ceil(count / limit)
            }
        });
    } catch (error) {
        console.error('Get orders error:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

module.exports = router;
