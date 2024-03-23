import { pool } from '../config/db.js'
import fs from 'node:fs/promises'

export const index = async (req, res) => {
  try {
    const [result] = await pool.execute('SELECT id, email, nombre, role, imagen FROM users')
    res.json(result)
  } catch (error) {
    res.status(500).json({ message: 'Error interno.' })
  }
}

export const getById = async (req, res) => {
  try {
    const [result] = await pool.execute('SELECT id, email, nombre, role, imagen FROM users WHERE id = ?', [req.params.id])
    if (result.length === 0) {
      return res.status(404).json({ message: 'Usuario no encontrado.' })
    }
    res.json(result[0])
  } catch (error) {
    res.status(500).json({ message: 'Error interno.' })
  }
}

export const store = async (req, res) => {
  try {
    // Extraer los datos enviados desde POST
    const {
      email,
      nombre,
      password,
      role
    } = req.body
    const { filename } = req.file

    // Validación de los datos
    if (
      !email?.includes('@') ||
      !nombre ||
      !password ||
      !role ||
      !filename
    ) {
      return res.status(400).json({ message: 'Faltan datos.' })
    }

    // Ingresar los datos a la db
    const [result] = await pool.execute(
      'INSERT INTO users (email, nombre, password, role, imagen) VALUES (?, ?, ?, ?, ?)',
      [email, nombre, password, role, filename]
    )

    // Validar el id del registro insertado
    if (!result.insertId) {
      return res.status(500).json({ message: 'Error al crear el usuario.' })
    }

    // Traer el usuario insertado
    const [user] = await pool.execute(
      'SELECT email, nombre, imagen FROM users WHERE id = ?',
      [result.insertId]
    )

    // Mensaje al cliente
    res.status(201).json({ message: 'Usuario creado.', user })
  } catch (error) {
    console.log(error)
    let message = 'Error interno'
    let statusCode = 500

    // Validar si el error es por un email duplicado. Si es así, borrar la imagen y cambiar el mensaje y código de error.
    if (error?.errno === 1062) {
      message = 'El email ya existe'
      statusCode = 400
      await fs.unlink(`uploads/${req.file.filename}`)
    }

    res.status(statusCode).json({ message })
  }
}

export const update = async (req, res) => {
  try {
    // Extraer los datos enviados desde PUT
    const {
      email,
      nombre,
      password,
      role
    } = req.body
    const { filename } = req.file
    const { id } = req.params

    // Validación de los datos
    if (
      !email?.includes('@') ||
      !nombre ||
      !password ||
      !role ||
      !filename
    ) {
      return res.status(400).json({ message: 'Faltan datos.' })
    }

    // Ingresar los datos a la db
    const [result] = await pool.execute(
      'UPDATE users SET email = ?, nombre = ?, password = ?, role = ?, imagen = ? WHERE id = ?',
      [email, nombre, password, role, filename, id]
    )

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Usuario no encontrado.' })
    }

    // Mensaje al cliente
    res.status(200).json({ message: 'Usuario actualizado.' })
  } catch (error) {
    console.log(error)
    let message = 'Error interno'
    let statusCode = 500

    // Validar si el error es por un email duplicado. Si es así, borrar la imagen y cambiar el mensaje y código de error.
    if (error?.errno === 1062) {
      message = 'El email ya existe'
      statusCode = 400
      await fs.unlink(`uploads/${req.file.filename}`)
    }

    res.status(statusCode).json({ message })
  }
}
export const remove = async (req, res) => {
  try {
    const { id } = req.params

    // Eliminar el usuario de la base de datos
    const [result] = await pool.execute('DELETE FROM users WHERE id = ?', [id])

    // Verificar si se eliminó algún usuario
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Usuario no encontrado.' })
    }

    // Mensaje al cliente
    res.status(200).json({ message: 'Usuario eliminado.' })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Error interno.' })
  }
}
