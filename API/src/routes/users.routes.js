import { Router } from 'express'
import { getById, index, store, update, remove } from '../controllers/users.controller.js'
import { uploadImage } from '../config/multer.js'

const router = Router()

router.get('/', index)

router.get('/:id', getById)

router.post('/store', uploadImage.single('profilePicture'), store)

router.put('/:id', uploadImage.single('profilePicture'), update)

router.delete('/:id', remove)

export default router
