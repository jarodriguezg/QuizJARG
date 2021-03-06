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



// Importar definicion de tablas Quiz y Comment en quiz.js
var Quiz    = sequelize.import(path.join(__dirname, 'quiz'));
var Comment = sequelize.import(path.join(__dirname, 'comment'));

Comment.belongsTo(Quiz);
Quiz.hasMany(Comment);

exports.Quiz    = Quiz;     // exportar definicion tabla Quiz
exports.Comment = Comment;  // exportar definicion tabla Comment

// Crear e inicializar tabla de preguntas en DB
sequelize.sync().then(function() {
    // ejecuta manejador tras crearse la tabla
    Quiz.count().then(function(count){
	if(count === 0) {
	    Quiz.create({ pregunta: 'Capital de Italia',
			  respuesta: 'Roma',
			  tema: 'Humanidades'
			});
	    Quiz.create({ pregunta: 'Capital de Portugal',
			  respuesta: 'Lisboa',
			  tema: 'Humanidades'
			})
	    .then(function(){ console.log('BD inicializada') });
	    };
    });
});

