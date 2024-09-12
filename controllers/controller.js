const { User, UserProfile, Desease, Symptom, Medicine, Doctor, Consultation } = require('../models/index')
const {dataUser} = require('../helpers/helper')
class Controller{

    static async getHome(req,res){
        try {


            // res.send("Home User")
            res.render('homeUser')
        } catch (error) {
            res.send(error.message)
        }
    }

    static async getProfile(req,res){
        try {
            let id = 1
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
            let id = 1
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

            let {id} = req.params
            let {DoctorId, dateOfConsul} = req.body

            await Consultation.create({UserId:id,DoctorId, dateOfConsul})  
            res.redirect("/users")
        } catch (error) {
            let {id} = req.params
            if(error.name==="SequelizeValidationError"){
                let err = error.errors.map(el=>{
                    // console.log(el.message)
                    return el.message
                })
                res.redirect(`/users/${id}/booking?error=${err}`)
            }else{
                res.send(error)
            }
        }
    }
}

module.exports = Controller