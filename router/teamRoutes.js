const express = require('express')
const router = express.Router()


router.get('/', (req, res) => {
    res.render('team')
});


router.get('/invite', (req, res) => {
    res.render('invitemember')
});


router.post('/invite', (req, res) => {
    res.redirect('/team');
});


router.delete('/:id', (req, res) => {
    res.redirect('/team');
});

module.exports = router;