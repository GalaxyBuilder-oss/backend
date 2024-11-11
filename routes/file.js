import express from "express";
import multer from "multer";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
dotenv.config();

const file = express.Router();

// Membuat instance S3Client untuk AWS SDK v3
const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

file.post("/upload/profile", upload.single("file"), async (req, res) => {
  const { username, email } = req.body;
  if (!username || !email){
    return res.status(400).send({message:"Username or email cannot null!",data:null,success:false})
  }
  if (req.file) {
    const user = await prisma.users.findFirst({
      where: {
        OR: [
          {
            username: username,
          },
          { email: email },
        ],
      },
    });
    const params = {
      Bucket: "portofolio2024", // Ganti dengan nama bucket Anda
      Key: `${Date.now()}_${req.file.originalname}`,
      Body: req.file.buffer,
      ContentType: req.file.mimetype,
      ACL: "public-read", // Atur akses file menjadi publik
    };

    try {
      const command = new PutObjectCommand(params);
      const data = await s3Client.send(command);

      user.profile_picture_url = `https://${params.Bucket}.s3.amazonaws.com/${params.Key}`;

	  user.updated_at = new Date()
      await prisma.users.update({
        where: {
          id: user.id,
        },
        data: user,
      });
      // Mengembalikan URL file yang di-upload
      res.status(200).send({
        message: "File berhasil di-upload!",
        fileUrl: user.profile_picture_url,
      });
    } catch (error) {
      console.log(error);
      res.status(500).send({ message: "Gagal meng-upload file", error });
    }
  } else {
    res.status(400).send({ message: "Tidak ada file yang di-upload" });
  }
});

file.post(
  "/upload/:idPortofolio/cover",
  upload.single("file"),
  async (req, res) => {
    if (req.file) {
      const { idPortofolio } = req.params;
      const portofolio = await prisma.portofolio.findFirst({
        where: {
          id: Number.parseInt(idPortofolio),
        },
      });
      const params = {
        Bucket: "portofolio2024", // Ganti dengan nama bucket Anda
        Key: `${Date.now()}_${req.file.originalname}`,
        Body: req.file.buffer,
        ContentType: req.file.mimetype,
        ACL: "public-read", // Atur akses file menjadi publik
      };

      try {
        const command = new PutObjectCommand(params);
        const data = await s3Client.send(command);

        portofolio.cover_url = `https://${params.Bucket}.s3.amazonaws.com/${params.Key}`;
		portofolio.updated_at = new Date()
		
        await prisma.portofolio.update({
          where: {
            id: portofolio.id,
          },
          data: portofolio,
        });
        // Mengembalikan URL file yang di-upload
        res.status(200).send({
          message: "File berhasil di-upload!",
          fileUrl: portofolio.cover_url,
        });
      } catch (error) {
        console.log(error);
        res.status(500).send({ message: "Gagal meng-upload file", error });
      }
    } else {
      res.status(400).send({ message: "Tidak ada file yang di-upload" });
    }
  }
);

export default file;
