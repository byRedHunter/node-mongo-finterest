const express = require('express')
const path = require('path')
const morgar = require('morgan')
const multer = require('multer')
const { v4: uuid } = require('uuid')
const { format } = require('timeago.js')

// Initializations
const app = express()
require('./database')

// Settings
app.set('port', process.env.PORT || 3000)
// --> motor de plantilla
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

// Middlewares
// funciones que procesan cosas antes de llegar a las rutas
app.use(morgar('dev'))
app.use(express.urlencoded({ extended: false }))
app.use(express.json())

// config multer
const storage = multer.diskStorage({
	destination: path.join(__dirname, 'public/img/uploads'),
	filename: (req, file, cb, filename) => {
		cb(null, uuid() + path.extname(file.originalname))
	},
})
// single, especifica el input por donde se subira la imagen
app.use(
	multer({
		storage,
	}).single('image')
)

// Global Variables
app.use((req, res, next) => {
	app.locals.format = format

	next()
})

// Routes
app.use(require('./routes/index'))

// Static Files
app.use(express.static(path.join(__dirname, 'public')))

// Start the Server
app.listen(app.get('port'), () => {
	console.log(`Server on port ${app.get('port')}`)
})
