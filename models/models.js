var path = require('path');

//Postgres DATABASE_URL = postgres://user:passwd@host:port/database
//SQLite   DATABASE_URL = sqlite://:@:/
var url = process.env.DATABASE_URL.match(/(.*)\:\/\/(.*?)\:(.*)@(.*)\:(.*)\/(.*)/);
var DB_name  = (url[6]||null);
var user     = (url[2]||null);
var pwd      = (url[3]||null);
var protocol = (url[1]||null);
var dialect  = (url[1]||null);
var port     = (url[5]||null);
var host     = (url[4]||null);
var storage  = process.env.DATABASE_STORAGE;

// Cargar modelo ORM
var Sequelize = require('sequelize');

// Usar BBDD SQLite o Postgres:
var sequelize = new Sequelize(DB_name, user, pwd,
			      { dialect: protocol,
				protocol: protocol,
				port: port,
				host: host,
			        storage: storage, // solo SQLite (.env)
				omitNull: true    // solo Postgres
			      }
			     );



// Importar definicion de tabla Quiz en quiz.js
var Quiz = sequelize.import(path.join(__dirname, 'quiz'));

exports.Quiz = Quiz; // exportar definicion tabla Quiz

// Crear e inicializar tabla de preguntas en DB
sequelize.sync().then(function() {
    // ejecuta manejador tras crearse la tabla
    Quiz.count().success(function(count){
	if(count == 0) {
	    Quiz.create({ pregunta: 'Capital de Italia',
			  respuesta: 'Roma'
			})
	    .success(function(){ console.log('BD inicializada') });
	    };
    });
});

