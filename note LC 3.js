/*
    --- Configurasi Project ---
    1. npm init -y
    2. npm i pg express ejs sequelize
    3. npm i -D nodemon sequelize-cli
    4a. buat file .gitignore > node_modules
    4b. buat file terminal.text to save the history of terminal execution 
        - create the syntax on the file first
        - copy and paste to terminal
        - execute

    --- Configurasi Database ---
    5. configurasi database, ref : https://sequelize.org/docs/v6/other-zpx 
        sequelize-cli init => untuk membuat folder config, migrations, models, seeders
        5.1 edit file config/config.json bagian development
        5.2 npx sequelize-cli db:create => untuk membuat database jika belum ada

    6. model & migration --
        6.1 npx sequelize-cli model:generate --name <nama_class (singular, PascalCase, English)> --attributes <column:dataType,column:dataType> 
            => untuk membuat file model dan migration. Tanpa pembuatan id, id sudah otomatis terbuat ketiga diexecute

        -- ADD NEW COLUMN --
        6.2 npx sequelize-cli migration:generate --name <nama_file_migration> => untuk membuat file migration baru
            https://sequelize.org/docs/v6/other-topics/migrations/#migration-skeleton
        6.3 edit file migration baru bagian function up dan down
            - up => await queryInterface addColumn
                https://sequelize.org/api/v6/class/src/dialects/abstract/query-interface.js~queryinterface#instance-method-addColumn
        
                await queryInterface.addColumn('tableName','name of new attribute', {sequelize.dataType})
                
                - untuk column FK
                    await queryInterface.addColumn('tableName','name of new attribute','{
                    type : Sequelize.DataType.dataType,
                    reference:{
                        model:"tableName PK",
                        key: "id"
                        }
                    })

            - down => queryInterface removeColumn, 
                https://sequelize.org/api/v6/class/src/dialects/abstract/query-interface.js~queryinterface#instance-method-removeColumn

                await queryInterface.removeColumn('tableName','name of new attribute',{})
        6.4 npx sequelize-cli db:migrate => untuk menjalankan file migration yang statusnya masih down

        6.5 edit file model untuk menambahkan attribut yang baru dibuat di dalam init (on FK model)
            new attribute: DataTypes.dataType
        
    7. ASSOCIATION 
        7.1. for FK Table on migration file
            - on attribute FK, add references{model:"tableName",key:"attribute PK"}
        7.2  on model file
            - for PK Model, put "className of PK Model.hasMany(models.className of FK Model)" on static associate
            - for FK Model, put "className of FK Model.belongsTo(models.className of PK Model)"
            ** on PK Model, for 1-1 use hasOne, for 1-N use hasMany,
            ** on FK Model, use belongsTo
        
        7.3 npx sequelize-cli db:migrate:status => optional, untuk melihat status dari file migration
        7.4 npx sequelize-cli db:migrate => untuk menjalankan file migration yang statusnya masih down

    8. SEEDING --
        8.1 npx sequelize-cli seed:generate --name <nama_file_seed> 
            => untuk membuat file seed baru
        8.2 on async up 
            - let arrayName (plural) = require('file json') mapping(element arrow function{})
            - on arrow function :
                - if there is id on JSON file, delete id from element
                - create createdAt and updatedAt on element = new Date()
                - return the element
            - outside arrow function : await queryInterface bulkInsert("tableName", arrayName)
        8.3 on async down
            - await queryInterface bulkDelete ('tableName', null, {})
        8.4 use db:seed:all on npx sequelize

    --- Routing ---
    9. routing (as usual)
        20. buat folder routers. create index.js
        21. - import router dari express .Router()
            https://expressjs.com/en/guide/routing.html (section express.Router). 
            - tampung di dalam variable router 
            - express require express router()
        22. import controller class
        23. use route method (get, post)
            router.get("/", Controller.something) (dont invoke method controller)
        24. export router

        -- on App.js
        25. express require express
        26. create variable app = invoke express
        27. create port variable 3000
        28. import router from index.js 
        29. use set method to setting view engine ejs (app.set(...))
            https://expressjs.com/en/guide/using-template-engines.html
        30. for input data from html, use express urlencoded with true extended    
            app.use = ...
                https://expressjs.com/en/5x/api.html#req.body
        31. use router (app use('/', router))
        32. use listen method for consol.log on terminal. listen method have 2 parameter, port and arrow function. use console.log on arrow function
            https://expressjs.com/en/starter/hello-world.html

    -- Show Data --
    ALWAYS USE STATIC ASYNC AWAIT TRY CATCH REQ RES
    10. On Controller
        1. import {modelName} from models index
        2. for search feature import {Op} from sequelize
        3. create variable orderBy to sorting data = {order:[['attributeName','asc/desc]]}
        4. create variable data to connect with class model.
        5. use findAll(orderBy) to show data
            variableName = await className.findAll(orderBy)
            res render homepage, {variableName}
        6. alternatif findAll() for join
            const variables = await modelName.findAll({
            include: modelName with FK attribute
            })
        5. Untuk memanggil attribute yang dibutuhkan saja, di dalam findAll()
                include: {
                    modelName relation(FK or else),
                    attribute: [attribute name from modelName relation]
                },
                where :attribtue op.gt = 0
                *gt = greater than 

        7. on catch, res send error.message
    11. On homepage ejs
        1. use bootstrap
        2. use foreach for looping data. use <% %> and <%= %>
        3. for kolom "No.", use idx (index looping). saat arrow function, terima 2 parameter (el, idx)
        4. Untuk jumlah data many, bisa pakai length dari kolom relasi, misal Author.Book.length()
            maka dari itu, untuk manggil attribute dari level 2, which is book, bisa langsung panggil aja attribute nya >> Author.Book.nameBook

    -- EDIT DATA
    12. Increment Sequelize
        on Controller
            - get id from req params
            - get data from await modelName.findAll()
            - await data increment('column',{by:1})
            - res redirect
    19. on Controller get edit data
        - destruct id from req params
        - if we have validation, destruct {error} from req query
        - create variable await to connect it with class model get data by id
        - render form ejs, send the data >> (res render ('...',{data, error}))
    20. on Controller post edit data
        - desctruct id from req params
        - destruct attribute from req body
        - await modelName.update({attribute}, {where:{id}})
        
    -- ADD DATA
    13. On Controller get add data
        1. let {id} from req params
        2. variableName = await modelName.findByPk(+id) // diperlukan untuk notifikasi
        3. findAll if need data relation from another table
        3. res render
    14. create file ejs
        1. form action="router post add data" method post
        2. for select option
            - give name on <select> atributeName
            - foreach data
            - on <option> name="id", value="value"
    15. hooks 
        https://sequelize.org/docs/v6/other-topics/hooks/#declaring-hooks
        --beforeCreate-- 
        digunakan untuk mengubah data sebelum data dimasukkan ke dalam database
        1. on Models. use 3rd method on Hook documentation
            via direct method
    16. on Controller post add data
        1. desctruct attribute from req body
        2. await moduleName.create({destructed attribute})
        3. res redirect
    17. validation
        https://sequelize.org/docs/v6/core-concepts/validations-and-constraints/#validators
        1. on file model inside init
            - ubah model penulisan tipe data menggunakan object
                attribute :{
                type: DataType.DATATYPE,

                validate: {
                    notNull:{
                    msg: "..."},
                    notEmpty:{
                    msg:"..."}
                }}
            - untuk minimal data, bisa gunakan keyword min di dalam validation
                gunakan args didalam min, msg="..."
            * notnull akan bekerja ketika attribute undefined
            * notEmpty akan bekerja ketika value attribute kosong
            * Custom Validation =>
                notEmpty:{...},
                customValidation(){
                    ...
                    if(...){
                    throw new Error('...)
                    }
                }
        2. on Controller inside catch error on post add data
            - if(name of error) === "Sequelize Validation Error"{
                const variableName = mapping error.errors(arror function)
                res.send(err)
                res.redirect(`...?error=${variableName}`)
              }else{
                res.send(error)
              }
        3. on get add data
            - destruct error from req query
            - send error on render like sending data
            - res render(... {..., error})
        4. on form input
            - if error === true then <p> error </>
           
    --- DELETE DATA ---
    18. on Controller
        - destruct id from req params
        - await modelName.destroy({where: {id} })
        - res redirect

    --- HELPER ---
    21. create folder helpers
    22. create file helpers
    23. create function as it needs
    24. export function
    25. on Controller
        - import helper function
        - send helper function to ejs, like send data
            res.render('...', {data, helper})

    --- Convert tanggal : use toISOString().slice(0,10)
    --- select option edit : use ternary operator, selected
    --- radio button edit : use ternary operator, checked

    --- SEARCH ---
    26. On EJS
        form method get action router
    27. on Controller get all data
        1. if search === true {
            where:{
                searchAttribute:{
                    [Op.iLike]: `${search}`
                }
             }
            }
        2. res render('...',{..., search})
    28. on EJS


    -- FILTER
*/

