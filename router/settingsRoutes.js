const express = require('express')
const router = express.Router();

router.get('/', (req, res) => {
    res.redirect('/settings/profile')
})

router.get('/profile', (req, res) => {
    res.render('settings', { section: 'profile' })
})

router.get('/notifications', (req, res) => {
    res.render('settings', { section: 'notifications' })
})

router.get('/security', (req, res) => {
    res.render('settings', { section: 'security' })
})

router.get('/appearance', (req, res) => {
    res.render('settings', { section: 'appearance' })
})

router.get('/billing', (req, res) => {
    res.render('settings', { section: 'billing' })
})

module.exports = router;