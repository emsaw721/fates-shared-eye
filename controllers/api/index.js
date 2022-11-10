const router = require('express').Router(); 

const { appendFile } = require('fs');
const apiRoutes = require('../api');
const dashboardRoutes = require('../dashboard-rooutes');
const homeRoutes = require('../home-routes'); 

router.use('/', homeRoutes);
router.use('/dashboard', dashboardRoutes); 
router.use('/api', apiRoutes);

module.exports = router; 