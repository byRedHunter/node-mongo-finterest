const { Router } = require('express')

const path = require('path')
const fs = require('fs-extra')
const router = Router()

// Models
const Image = require('../models/Image')

// Routes
router.get('/', async (req, res) => {
	const images = await Image.find()

	res.render('index', { images })
})

router.get('/upload', (req, res) => {
	res.render('upload')
})
router.post('/upload', async (req, res) => {
	const image = new Image()

	image.title = req.body.title
	image.description = req.body.description
	image.filename = req.file.filename
	image.path = '/img/uploads/' + req.file.filename
	image.originalname = req.file.originalname
	image.mimetype = req.file.mimetype
	image.size = req.file.size

	// guarda en la db
	await image.save()

	res.redirect('/')
})

router.get('/image/:id', async (req, res) => {
	const { id } = req.params
	const image = await Image.findById(id)

	res.render('profile', { image })
})
router.get('/image/:id/delete', async (req, res) => {
	const { id } = req.params
	try {
	} catch (error) {}

	try {
		// elimina de la db
		const Deleted = await Image.findByIdAndDelete(id)
		// elimina de imagenes
		await fs.unlink(path.resolve('./src/public' + Deleted.path))
		res.redirect('/')
	} catch (err) {
		console.error('Error: ', err.message)
	}
})

module.exports = router
