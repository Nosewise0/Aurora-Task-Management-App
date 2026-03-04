const express = require('express')
const router = express.Router();


router.get('/', (req, res) => {
    res.render('tasks')
});

router.get('/new', (req, res) => {
    res.render('newtask')
});

router.post('/', (req, res) => {
    res.redirect('/tasks');
});


router.get('/:id', (req, res) => {
    res.send('Task details stub');
});

router.get('/:id/edit', (req, res) => {
    res.send('Edit task form stub');
});

router.put('/:id', (req, res) => {
    res.redirect('/tasks');
});

router.delete('/:id', (req, res) => {
    res.redirect('/tasks');
});

module.exports = router;