const db = require('../database/models');
const sequelize = db.sequelize;

//Otra forma de llamar a los modelos
const Movies = db.Movie;

const moviesController = {
    'list': (req, res) => {
        db.Movie.findAll()
            .then(movies => {
                res.render('moviesList.ejs', {movies})
            })
    },
    'detail': (req, res) => {
        db.Movie.findByPk(req.params.id)
            .then(movie => {
                res.render('moviesDetail.ejs', {movie});
            });
    },
    'new': (req, res) => {
        db.Movie.findAll({
            order : [
                ['release_date', 'DESC']
            ],
            limit: 5
        })
            .then(movies => {
                res.render('newestMovies', {movies});
            });
    },
    'recomended': (req, res) => {
        db.Movie.findAll({
            where: {
                rating: {[db.Sequelize.Op.gte] : 8}
            },
            order: [
                ['rating', 'DESC']
            ]
        })
            .then(movies => {
                res.render('recommendedMovies.ejs', {movies});
            });
    }, //Aqui debemos modificar y completar lo necesario para trabajar con el CRUD
    add: function (req, res) {
        db.Genre.findAll({
            order : [
                ['name']
            ]
        })
        .then(genres => { 
        return res.render('moviesAdd' , {
            genres
        })  
    })
    .catch(error => console.log(error))
    },

    create: function (req, res) {
        const{title, release_date, awards, rating, length, genre_id} = req.body

        if([title, release_date, awards, rating, length, genre_id].includes("")){
            db.Genre.findAll({
                order : [
                    ['name']
                ]
        })
        .then(genres => { 
            return res.render('moviesAdd' , {
                messageError : "Todos los campos son obligaorios",
                genres
            })
        }) 
            .catch(error => console.log(error))

    }else{
            db.Movie.create({
            title: title.tram(),
            release_date,
            length : +length,
            genre_id,
            awards: +length,
            rating: +length
        })
            .then(newMovie => {
                console.log(newMovie);
                return res.redirect('/movies/detail/' + newMovie.id)
            })
            .catch(erro => console.log(error)) 
        }
        
    },
    edit: function(req, res) {
      const genres = db.Genre.findAll({
        oreder : [
            ['name']
        ]
      })
      const movie = db.Movie.findByPk(req.params.id)

      Promise.all([genres, movie])
      .then(([genres , movie]) => {
        return res.render('moviesEdit',{
            genres,
            movie
        })
      })
      .catch(erro => console.log(error)) 

    },
    update: function (req,res) {
        // TODO
    },
    delete: function (req, res) {
        // TODO
    },
    destroy: function (req, res) {
        // TODO
    }

}

module.exports = moviesController;