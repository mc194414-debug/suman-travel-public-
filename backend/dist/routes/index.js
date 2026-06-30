"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../middlewares/auth");
const router = (0, express_1.Router)();
// 1. Vehicle Routes
router.get('/vehicles', (req, res) => {
    res.json({
        success: true,
        data: [
            { id: '1', name: 'Toyota Innova Crysta', category: 'MUV', price: 3800 },
            { id: '2', name: 'Toyota Innova Hycross', category: 'Luxury MUV', price: 4500 },
            { id: '3', name: 'Suzuki Ertiga', category: 'MUV', price: 3000 },
            { id: '4', name: 'Swift Dzire', category: 'Sedan', price: 2500 }
        ],
        message: 'Vehicles retrieved successfully'
    });
});
// 2. Pricing Calculator
router.post('/pricing/calculate', (req, res) => {
    const { extraHours = 0, extraKm = 0 } = req.body;
    const base = 3000;
    const hourRate = 200;
    const kmRate = 18;
    res.json({
        success: true,
        data: {
            basePrice: base,
            extraHourCharges: extraHours * hourRate,
            extraKmCharges: extraKm * kmRate,
            nightCharge: 0,
            totalAmount: base + (extraHours * hourRate) + (extraKm * kmRate)
        },
        message: 'Fare calculation completed'
    });
});
// 3. Enquiry / Contact Form submission
router.post('/contact', (req, res) => {
    res.json({
        success: true,
        message: 'Contact form submitted successfully, ticket created'
    });
});
// 4. Secure Booking Route (Requires Login Stub)
router.post('/bookings', auth_1.authenticateJWT, (req, res) => {
    res.status(201).json({
        success: true,
        data: {
            bookingId: 'booking-mock-uuid-101',
            status: 'pending',
            totalAmount: 4500
        },
        message: 'Booking generated'
    });
});
exports.default = router;
