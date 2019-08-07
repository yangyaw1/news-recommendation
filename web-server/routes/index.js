const { Router } = require('express');
const path = require('path');

const router = Router();

/* GET index page. */
router.get('/', (req, res) => {
    res.sendFile('index.html', { root: path.join(__dirname, '../../client/build/') });
});

module.exports = router;
