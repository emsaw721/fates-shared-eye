const router = require('express').Router();
const homeRoutes = require('./home-routes'); 
const dashboardRoutes = require('./dashboard-rooutes')

const apiRoutes = require('./api/');


router.use('/', homeRoutes); 
router.use('/dashboard', dashboardRoutes); 
router.use('/api', apiRoutes);


router.use((req, res) => {
  res.status(404).end();
});

module.exports = router;