const { User, UserProfile, Desease, Symptom, Medicine, Doctor, Consultation, Sequelize } = require('../models/index')
const { formatDate } = require('../helpers/formatDate');
const bcrypt = require('bcryptjs');


class Controller{
    static async checkAuth(req, res, next){
        if (!req.session.user) {
          return res.redirect('/login');
        }
        next();
      };


    static async getProfile(req,res){
        try {
            let {id}= req.params

            let data = await User.findOne({
                where:{id},
                include:[
                    {
                        model: Consultation,
                        attributes:{exclude:["createdAt","updatedAt"]},
                        include: [
                            {
                                model: Doctor,
                                attributes:{exclude:["createdAt","updatedAt"]},
                            },
                            {
                                model: Desease,
                                attributes:{exclude:["createdAt","updatedAt"]},
                                include:[
                                    {
                                    model: Symptom,
                                    attributes:{exclude:["createdAt","updatedAt"]},
                                    },
                                    {
                                    model: Medicine,
                                    attributes:{exclude:["createdAt","updatedAt"]},
                                    },
                                ]
                            }
                        ]
                    },
                    {
                        model:UserProfile,
                        attributes:{exclude:["updatedAt"]}
                    }

                ],
                attributes:{exclude:["createdAt","updatedAt"]}
            })

            let profile = data.UserProfile

            if(profile===null){
                res.redirect(`/users/${id}/userprofile`)
            }

            let history = data.Consultations

            let dokter = history.map(el=>{
                return el.Doctor
            })

            let desease = history.map(el=>{
                return el.Desease
            })

            let symptoms = desease.map(el=>{
                return el.Symptom
            })

            let medic = desease.map(el=>{
                return el.Medicines
            })
            let datas = {profile, history, dokter, desease, symptoms, medic}



            res.render('profileUser', {datas})
            // res.send({data})
        } catch (error) {
            res.send(error.message)
        }
    }

    static async getBooking(req,res){
        try {
            let id = req.session.user.id
            // let dataId = await User.findByPk(+id)
            
            let {error} = req.query
            console.log(error)
            let data = await Doctor.findAll()

            res.render('booking', {data, id, error})
            // res.send({data})
        } catch (error) {
            console.log(error)
            res.send(error.message)
        }
    }

    static async postBooking(req,res){
        try {

            let data = req.session.user
            let UserId = data.id
            let {DoctorId, dateOfConsul} = req.body

            await Consultation.create({UserId,DoctorId, dateOfConsul})  
            res.redirect(`/users/${UserId}`)
        } catch (error) {
            let data = req.session.user
            let id = data.id
            if(error.name==="SequelizeValidationError"){
                let err = error.errors.map(el=>{
                    // console.log(el.message)
                    return el.message
                })
                res.redirect(`/users/${id}/booking?error=${err}`)
            }else{
                console.log(error)
                res.send(error.message)
            }
        }
    }

    static async showConsultation(req, res) {
        try {
            let {notif} = req.query
            let {del} = req.query
            let data = await Consultation.findAll({
                    attributes:{exclude:["createdAt","updatedAt"]},
                    include: [
                        {
                            model:User,
                            attributes:{exclude:["createdAt","updatedAt"]},
                            include:{
                                model:UserProfile,
                                attributes:{exclude:["createdAt","updatedAt"]},        
                            }
                        },
                        {
                            model: Doctor,
                            attributes:{exclude:["createdAt","updatedAt"]},
                        },
                        {
                            model: Desease,
                            attributes:{exclude:["createdAt","updatedAt"]},
                            include:[
                                {
                                model: Symptom,
                                attributes:{exclude:["createdAt","updatedAt"]},
                                },
                                {
                                model: Medicine,
                                attributes:{exclude:["createdAt","updatedAt"]},
                                },
                            ]
                        }
                    ],
            })
            // res.send({data})
            res.render('homeAdmin', { data, formatDate, del, notif });
        } catch (error) {
            res.send(error.message);
        }
    }

    static async getDeleteConsultation(req,res){
        try {
            let {id} = req.params
            let notif = "Data berhasil di delete"

            await Consultation.destroy({
                where:{id}
            })

            res.redirect(`/?del=${notif}`)
        } catch (error) {
            res.send(error.message)
        }
    }

    static async register(req, res) {

        try {
            if(req.session.user){
                let data = req.session.user
                let id = data.id
                res.redirect(`/users/${id}`)
            }
            res.render('register')
        } catch (error) {
            res.send(error.message);
        }
    }

    static async postRegister(req, res) {
        try {
            let { email, username, password } = req.body;
            await User.create({ email, username, password })

            res.redirect('/login');
        } catch (error) {
            res.send(error.message);
        }
    }

    static async login(req, res) {
        try {
            let {error} = req.query
            if(req.session.user){
                let data = req.session.user
                let id = data.id
                res.redirect(`/users/${id}`)
            }
            res.render('login', {error})
        } catch (error) {
            res.send(error.message);
        }
    }

    static async postLogin(req, res) {
        try {
            let { username, password } = req.body;

            let data = await User.findOne({where:{username}})

            let user = data.username
            let pass = data.pass
            // Verifikasi username dan password
            // if (user && user.password === password) {
            //     req.session.user = user;
            //     res.redirect('/dashboard');
            //     } else {
            //     res.render('login', { message: 'Username atau password salah!' });
            // }
            if(user){
                const isValidPassword = await bcrypt.compare(password, data.password);
    
                if (!isValidPassword) {
                    return res.render('login', { message: 'Username atau password salah!' });
                  }
    
                  
                req.session.user = data
                let id = data.id
                let role = data.role
                if(role === "admin"){
                    res.redirect('/')
    
                }if(role === "user"){
                    res.redirect(`/users/${id}`)
                }

            }else{
            }
            // res.send(data)
            // res.render('login')
        } catch (error) {
            // if(error.name = SequelizeValidationError){
            //     let err = error.errors.map(el=>el.message)
                res.redirect(`/login?error=Username/password salah`);
            // }
            // res.send(error);
        }
    }

    static async getUserProfile(req,res){
        try {
            let {id} = req.params
            let data = await User.findByPk(+id)
            // res.send({data})
            res.render('userProfile', {data})
        } catch (error) {
            res.send(error.message)
        }
    }

    static async postUserProfile(req,res){
        try {
            let {id} = req.params
            let {firstName, lastName, avatar} = req.body
            await UserProfile.create({firstName, lastName, avatar, UserId:id})
            res.render('profileUser')
        } catch (error) {
            res.send(error.message)
        }
    }

    static async getLogout(req,res){
        req.session.destroy(); // Menghapus sesi
        console.log(req.session)
        res.redirect('/login');
        
    }

    static async getEditAdmin(req,res){
        let{id} = req.params

        let dataDoc = await Doctor.findAll()
        let dataDesease = await Desease.findAll()

        let data = await Consultation.findOne(
            {where:{id},
            attributes:{exclude:["createdAt","updatedAt"]},
            include: [
                {
                    model:User,
                    attributes:{exclude:["createdAt","updatedAt"]},
                    include:{
                        model:UserProfile,
                        attributes:{exclude:["createdAt","updatedAt"]},        
                    }
                },
                {
                    model: Doctor,
                    attributes:{exclude:["createdAt","updatedAt"]},
                },
                {
                    model: Desease,
                    attributes:{exclude:["createdAt","updatedAt"]},
                    include:[
                        {
                        model: Symptom,
                        attributes:{exclude:["createdAt","updatedAt"]},
                        },
                        {
                        model: Medicine,
                        attributes:{exclude:["createdAt","updatedAt"]},
                        },
                    ]
                }
            ],
        })

        // res.send({data, dataDoc, dataDesease})
        res.render('editAdmin', {data, dataDoc, dataDesease})

    }

    static async postEditAdmin(req,res){

        let {id} = req.params
        let {DoctorId} = req.body

        await Consultation.update({DoctorId}, {where:{id}})

        res.redirect(`/?notif="Data berhasil diperbarui`)

    }
}

module.exports = Controller