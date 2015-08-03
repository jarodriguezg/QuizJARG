/* MW de autorizacion de accesos HTTP restringidos
exports.loginRequired = function(req, res, next) {
    if(req.session.user) { next(); }
    else { res.redirect('/login'); }
}; */

// GET /login -- Formulario de login
exports.new = function(req, res) {
    var errors = req.session.errors || {};
    req.session.errors = {};

    res.render('sessions/new', { errors: errors });
};

// POST /login -- Crear sesion
exports.create = function(req, res) {
    
    var login    = req.body.login;
    var password = req.body.password;
    
    var userController = require('./user_controller');
    userController.autenticar(login, password, function(error, user) {

	if(error) { // si existe error devolvemos mensaje de error
	    req.session.errors = 
		[{ "message": 'Se ha producido un error: ' + error }];
	    res.redirect("/login");
	    return;
	}

	// Crear req.session.user y guardar campos: id y username
	req.session.user = { id: user.id, username: user.username };
	
	// redireccion a path anterior a login
	res.redirect(req.session.redir.toString());
    });
};

// DELETE /logout -- Destruir sesion
exports.destroy = function(req, res) {
    delete req.session.user;
    // redireccion a path anterior a login
    res.redirect(req.session.redir.toString());
};
