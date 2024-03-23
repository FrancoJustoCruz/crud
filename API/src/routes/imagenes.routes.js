import { uploadImage } from '../config/multer.js'
import { Router } from 'express'
import { getImageByFilename, getImageNames, uploadImageFn } from '../controllers/imagenes.controller.js'

// Función para manejar el error
const handleError = (err, req, res, next) => {
  console.log(err)
  res.status(400).json({ error: 'Solo se admiten imágenes' })
}

const router = Router()

// Ruta para obtener todos los nombres de las imágenes existentes.
router.get('/', getImageNames)

// Ruta para mostrar una imagen
router.get('/:filename', getImageByFilename)

// Ruta para subir archivos y manejar el error de cuando no es una imagen
router.post('/upload', uploadImage.single('imagen'), handleError, uploadImageFn)

export default router
