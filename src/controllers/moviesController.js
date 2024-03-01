const db = require('../database/models');
const sequelize = db.sequelize;

//Otra forma de llamar a los modelos
const Movies = db.Movie;

const moviesController = {
    'list': (req, res) => {
        db.Movie.findAll()
            .then(movies => {
                res.render('moviesList.ejs', { movies })
            })
    },
    'detail': (req, res) => {
        db.Movie.findByPk(req.params.id)
            .then(movie => {
                res.render('moviesDetail.ejs', { movie });
            });
    },
    'new': (req, res) => {
        db.Movie.findAll({
            order: [
                ['release_date', 'DESC']
            ],
            limit: 5
        })
            .then(movies => {
                res.render('newestMovies', { movies });
            });
    },
    'recomended': (req, res) => {
        db.Movie.findAll({
            where: {
                rating: { [db.Sequelize.Op.gte]: 8 }
            },
            order: [
                ['rating', 'DESC']
            ]
        })
            .then(movies => {
                res.render('recommendedMovies.ejs', { movies });
            });
    }, //Aqui debemos modificar y completar lo necesario para trabajar con el CRUD
    add: function (req, res) {
        db.Genre.findAll({
            order: [
                ['name']
            ]
        })
            .then((genres) => {
                return res.render('moviesAdd', {
                    genres
                })
            })
            .catch(error => console.log(error))
    },
    create: function (req, res) {
        const { title, release_date, awards, rating, length, genre_id } = req.body

        if ([title, release_date, awards, rating, length, genre_id].includes("")) {
            db.Genre.findAll({
                oreder: [
                    ["name"]
                ]
            })
                .then(genres => {
                    return res.render('moviesAdd', {
                    messageError: "Todos los campos son obligatorios",
                    genres
                })
            })
                    
        } else {

            db.Movie.create({
                title: title.trim(),
                release_date,
                length: +length,
                genre_id,
                awards: +awards,
                rating: +rating,
            })
                .then(newMovie => {
                    console.log(newMovie);
                    return res.redirect('/movies/detail/' + newMovie.id)
                })
                .catch(error => console.log(error))
        }


    },
    edit: function (req, res) {
        const genres = db.Genre.findAll({
            order: [
                ['name']
            ]
        })
        const movie = db.Movie.findByPk(req.params.id)

        Promise.all([genres, movie])
            .then(([genres, movie]) => {
                console.log(movie.release_date)
                return res.render('moviesEdit', {
                    genres,
                    movie
                })
            })
            .catch(error => console.log(error))
    },
    update: function (req, res) {
        // TODO
        const {title,release_date,length,genre_id,awards,rating} = req.body;


        if ([title, release_date, awards, rating, length, genre_id].includes("")) {
            db.Genre.findAll({
                oreder: [
                    ["name"]
                ]
            })
                .then(genres => {
                    return res.render('moviesAdd', {
                    messageError: "Todos los campos son obligatorios",
                    genres
                })
            })
                    
        } else {

            db.Movie.update(
                {
                    title: title.trim(),
                    release_date,
                    length: +length,
                    genre_id,
                    awards: +awards,
                    rating: +rating,
                },
                {
                    where : {
                        id : req.params.id
                    }
                }
            )
                .then(movieUpdated => {
                    console.log(movieUpdated)
                    return res.redirect('/movies/detail/' + req.params.id)
                })
                .catch(error => console.log(error))
        }
        
    },
    delete: function (req, res) {
        // TODO
        db.Movie.findByPk(req.params.id)
            .then(movie => {
                return res.render('moviesDelete', {
                    movie
                })
            })
    },
    destroy: function (req, res) {
        // TODO
        db.Movie.destroy({
            where : {
                id : req.params.id
            }
        })
            .then(movieDeleted => {
                console.log(movieDeleted)
                return res.redirect('/movie/list')
            })
            .catch(error=> console.log(error))
    }

}

module.exports = moviesController;