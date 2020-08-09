const express = require('express');
const router = express.Router();
const Telegram = require('../models/Telegram');

// same as /telegrams
router.get('/', async (req, res) => {
    try {
        const telegrams = await Telegram.find();
        res.json(telegrams);
    } catch(err) {
        res.json({ message: err })
    }
});

// submit a post
router.post('/', async (req, res) => {
    const newTelegram = new Telegram({
        address: req.body.address,
        message: req.body.message
    });

    try {
        const savedTelegram = await newTelegram.save()
        res.json(savedTelegram);
    } catch(err) {
        res.json({ message: err })
    }
});

// get back a specific post
router.get('/:telegramId', async (req, res) => {
    try {
        const telegram = await Telegram.findById(req.params.telegramId);
        res.json(telegram); 
    } catch (err) {
        res.json({ message: err })
    }
});

// delete a specific post
router.delete('/:telegramId', async (req, res) => {
    try {
        const removedTelegram = await Telegram.remove({
            _id: req.params.telegramId,
        });
        res.json(removedTelegram);
    } catch (err) {
        res.json({ message: err });
    }
});

// update a telegram's address
router.patch('/:telegramId', async (req, res) => {
    try {
        const updatedTelegram = await Telegram.updateOne({ 
            _id: req.params.telegramId}, 
            { $set: { address: req.body.address}}
        );
        res.json(updatedTelegram);
    } catch (err) {
        res.json({ message: err });
    }
});

module.exports = router;