const Controller = require('../controllers/controller')

const router = require('express').Router()

const session = require('express-session')


// middleware
router.use(session({
    secret: 'secret-key', // ganti dengan kunci rahasia yang lebih aman
    resave: false,
    saveUninitialized: true
  }));

router.get('/', Controller.checkAuth, Controller.showConsultation)
router.get('/:id/edit', Controller.checkAuth, Controller.getEditAdmin)
router.post('/:id/edit', Controller.checkAuth, Controller.postEditAdmin)
router.get('/:id/delete', Controller.getDeleteConsultation)
router.get('/users/:id', Controller.checkAuth, Controller.getProfile)
router.get('/users/:id/userprofile', Controller.checkAuth, Controller.getUserProfile)
router.post('/users/:id/userprofile', Controller.checkAuth, Controller.postUserProfile)
router.get('/users/:id/booking', Controller.checkAuth, Controller.getBooking)
router.post('/users/:id/booking', Controller.checkAuth, Controller.postBooking)

router.get('/regis', Controller.register);
router.post('/regis', Controller.postRegister);

router.get('/login', Controller.login);
router.post('/login', Controller.postLogin)


router.get('/logout', Controller.getLogout)




module.exports = router