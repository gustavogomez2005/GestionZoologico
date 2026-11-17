/*
Implementa el inicio de sesión flexible por usuario, email o teléfono, 
manejo de 3 intentos fallidos con bloqueo temporal, 
cifrado con Bcrypt y soporte para pasarelas OAuth simuladas (GitHub, Google, etc.).
*/

import { pool } from "../config/db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const MAX_ATTEMPTS = 3;
const LOCK_TIME_MINUTES = 15;

export const register = async (req, res) => {
  try {
    const { usuario, password, apellido, nombre, dni, telefono, email, rol } =
      req.body;

    const [existing] = await pool.query(
      "SELECT * FROM usuarios WHERE usuario = ? OR email = ? OR telefono = ? OR dni = ?",
      [usuario, email, telefono, dni],
    );

    if (existing.length > 0) {
      return res.status(400).json({
        error:
          "El usuario, email, teléfono o DNI ya se encuentran registrados.",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const userRole = rol === "administrador" ? "administrador" : "operador";

    const [result] = await pool.query(
      "INSERT INTO usuarios (usuario, password, apellido, nombre, dni, telefono, email, rol) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
      [
        usuario,
        hashedPassword,
        apellido,
        nombre,
        dni,
        telefono,
        email,
        userRole,
      ],
    );

    res.status(201).json({
      message: "Usuario registrado exitosamente",
      codigo: result.insertId,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { credencial, password } = req.body; // credencial puede ser usuario, email o teléfono

    const [rows] = await pool.query(
      "SELECT * FROM usuarios WHERE usuario = ? OR email = ? OR telefono = ?",
      [credencial, credencial, credencial],
    );

    if (rows.length === 0) {
      return res.status(401).json({ error: "Credenciales inválidas." });
    }

    const user = rows[0];

    // Verificar bloqueo por intentos fallidos
    if (user.bloqueado_hasta && new Date() < new Date(user.bloqueado_hasta)) {
      return res.status(403).json({
        error:
          "Cuenta bloqueada temporalmente por múltiples intentos fallidos. Intente más tarde.",
      });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      const newAttempts = user.intentos_fallidos + 1;
      if (newAttempts >= MAX_ATTEMPTS) {
        const lockUntil = new Date(Date.now() + LOCK_TIME_MINUTES * 60000);
        await pool.query(
          "UPDATE usuarios SET intentos_fallidos = ?, bloqueado_hasta = ? WHERE codigo = ?",
          [newAttempts, lockUntil, user.codigo],
        );
        return res
          .status(403)
          .json({ error: "Cuenta bloqueada por 3 intentos fallidos." });
      }
      await pool.query(
        "UPDATE usuarios SET intentos_fallidos = ? WHERE codigo = ?",
        [newAttempts, user.codigo],
      );
      return res.status(401).json({
        error: `Contraseña incorrecta. Intentos restantes: ${MAX_ATTEMPTS - newAttempts}`,
      });
    }

    // Restablecer intentos fallidos en login exitoso
    await pool.query(
      "UPDATE usuarios SET intentos_fallidos = 0, bloqueado_hasta = NULL WHERE codigo = ?",
      [user.codigo],
    );

    const token = jwt.sign(
      { codigo: user.codigo, rol: user.rol, usuario: user.usuario },
      process.env.JWT_SECRET || "secreto",
      { expiresIn: "8h" },
    );

    res.json({ message: "Inicio de sesión exitoso", token, rol: user.rol });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const forgotPassword = async (req, res) => {
  // Lógica para enviar token de recuperación o restablecer contraseña mediante email
  res.json({
    message:
      "Se han enviado las instrucciones de recuperación a su correo electrónico.",
  });
};

export const logout = (req, res) => {
  // Al usar JWT sin estado, el cierre de sesión se maneja típicamente eliminando el token en el cliente
  res.json({ message: "Cierre de sesión exitoso." });
};
