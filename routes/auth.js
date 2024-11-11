import express from "express";
import { PrismaClient } from "@prisma/client";
import argon2 from "argon2";
import jwt from "jsonwebtoken";
const prisma = new PrismaClient();
const auth = express.Router();

auth.post("/register/v1/user", async (req, res) => {
  const {
    userName,
    email,
    password,
    fullName,
    phoneNumber,
    address,
    isActive,
    isVerified,
    profileUrl,
  } = req.body;
  const hashedPassword = await argon2.hash(password);
  try {
    const userValid = await prisma.users.findFirst({
      where: {
        OR: [{ username: userName }, { email: email }],
      },
    });
    if (userValid) {
      return res
        .status(400)
        .send({ message: "User telah ada", data: null, success: false });
    }

    const result = await prisma.users.create({
        data: {
            username: userName,
            email: email,
    password: JSON.parse(hashedPassword),
            full_name: fullName,
            phone_number: phoneNumber,
            address: address,
            created_at: new Date(),
            updated_at: null,
            is_active: isActive,
            is_verified: isVerified,
            profile_picture_url: profileUrl
        }
    })

    delete result.id;
    res.send({
      message: "User berhasil ditambah!",
      data: result,
      success: true,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      message: "Gagal menambahkan user! ",
      data: null,
      success: false,
    });
  }
});

auth.post("/login/v1/user", async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await prisma.users.findFirst({
      where: {
        username: username,
      },
    });
    if (!user) {
      return res
        .status(404)
        .send({ message: "User tidak ditemukan.", data: null, success: false });
    }
    const isPasswordValid = await argon2.verify(
      JSON.parse(user.password),
      password
    );
    if (isPasswordValid) {
      const token = jwt.sign(
        { id: user.id, username: user.username },
        process.env.SECRET_KEY,
        {
          expiresIn: "1h",
        }
      );
      return res
        .status(200)
        .send({ message: "Login Sukses!", data: token, success: true });
    } else {
      return res
        .status(400)
        .send({ message: "Gagal Login!", data: null, success: false });
    }
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .send({ message: "Ada Kesalahan!", data: null, success: false });
  }
});

export default auth;
