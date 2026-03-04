const express = require('express')
const router = express.Router()

// GET team members list
router.get('/', (req, res) => {
    res.render('team')
});

// GET invite member form
router.get('/invite', (req, res) => {
    res.render('invitemember')
});

// POST send invitation (Stub)
router.post('/invite', (req, res) => {
    res.redirect('/team');
});

// DELETE team member (Stub)
router.delete('/:id', (req, res) => {
    res.redirect('/team');
});

module.exports = router;