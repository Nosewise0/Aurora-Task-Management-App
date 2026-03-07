const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.render('projects');
});

router.get('/new', (req, res) => {
    res.render('newproject');
});

module.exports = router;