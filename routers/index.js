const Controller = require('../controllers/controller')

const router = require('express').Router()

router.get('/', Controller.getHome)
router.get('/users', Controller.getProfile)
router.get('/users/:id/booking', Controller.getBooking)
router.post('/users/:id/booking', Controller.postBooking)




module.exports = router