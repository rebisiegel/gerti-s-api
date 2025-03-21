import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { createUser, getUserByEmail } from "../models/userModel.js";
import pool from "../config/database.js";
const router = express.Router();
const secret = "secretkey";

router.post("/signup", async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      phoneNumber,
      password,
      confirmPassword,
    } = req.body;

    // Jelszó egyezés ellenőrzése
    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "A jelszavak nem egyeznek",
      });
    }

    // Email cím ellenőrzése, hogy nem foglalt-e
    const existingUser = await getUserByEmail(email);

    if (existingUser && Object.keys(existingUser).length > 0) {
      return res.status(400).json({
        success: false,
        message: "Ez az email cím már regisztrálva van",
      });
    }

    // Új felhasználó beszúrása
    const hashedPassword = await bcrypt.hash(password, 10);

    const userId = {
      first_name: firstName,
      last_name: lastName,
      email: email,
      telephone: phoneNumber,
      password: hashedPassword,
      role: "user"
    };

    const result = await createUser(userId);

    res.json({
      success: true,
      userId: result,
      message: "Sikeres regisztráció",
    });
  } catch (error) {
    console.error("Regisztrációs hiba:", error);
    res.status(500).json({
      success: false,
      message: "Hiba történt a regisztráció során",
    });
  }
});

router.post("/login", async (req, res) =>{
  const {email, password} = req.body;

  try{
    const user = await getUserByEmail(email);
    if (! user) {
      return res.status(401).json({
        success: false,
        message: "Nincs ilyen felhasználó",
      });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({
        success: false,
        message: "Hibás jelszó",
      });
    }

    const token = jwt.sign( {email: user.email, role: user.role}, secret, {expiresIn: "1h"});
    res.cookie("token", token, {httpOnly: true, secure: true});

    return res.status(200).json({
      success: true,
      message: "Sikeres bejelentkezés",
      user: {
        id: user.id,
        first_name: user.first_name,
        last_name: user.last_name,
        telephone: user.telephone,
        email: user.email,
        role: user.role,
      },
    });

  }catch (error) {
    console.error("Bejelentkezési hiba:", error);
    res.status(500).json({
      success: false,
      message: "Hiba történt a bejelentkezés során",
    });
  }
});

export default router;

