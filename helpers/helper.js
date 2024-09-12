const { User, UserProfile, Desease, Symptom, Medicine, Doctor, Consultation } = require('../models/index')

const dataUser = function(id){
    User.findByPk(id,  {
        include:{
            model: Consultation,
            include: {
                model: Doctor,
                attributes:{exclude:["createdAt","updatedAt"]}
            },
            include:{
                model: Desease,
                attributes:{exclude:["createdAt","updatedAt"]}
            },
            attributes:{exclude:["createdAt","updatedAt"]}
            
        },
        attributes:{exclude:["createdAt","updatedAt"]}
    })
}

module.exports = {dataUser}