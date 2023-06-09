const { create } = require('../services/productService');

const router = require('express').Router();

router.get('/', (req, res) => {
    res.render('create');
});

router.post('/', (req, res) => {
    create(req.body.name, Number(req.body.price));
    res.redirect('/catalog');
});

module.exports = router;