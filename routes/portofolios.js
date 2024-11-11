import express from "express"
import { PrismaClient } from "@prisma/client"

const portofolios = express.Router()
const prisma = new PrismaClient()

portofolios.get("/", async (req, res) => {
    try {

        const allPortofolios = await prisma.portofolio.findMany();
        res.status(200).send({ message: "Berhasil Mendapatkan Data!", data: allPortofolios, status: true });
    } catch (error) {
        console.error(error)
        res.status(500).send({ message: "Gagal mendapatkan data", data: null, success: false })
    }
})

portofolios.post("/", async (req, res) => {
    const { projectName, description, status, budget, startDate, endDate } = req.body;
    try {
        const result = await prisma.portofolio.create({
            data: {
                project_name: projectName,
                description: description,
                budget: budget,
                status: status,
                start_date: startDate,
                end_date: endDate,
                created_at: new Date(),
                updated_at: null,
                user_id: 1
            },
        })
        delete result.id;
        res.send({ message: "Portofolio berhasil ditambah", data: result, success: true });
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: "Terjadi kesalahan dalam menambah portofolio", data: null, success: false });
    }
});

portofolios.delete("/:idPortofolio", async (req, res) => {
    const portofolioId = req.params.idPortofolio
    try {

        const result = await prisma.portofolio.delete({
            where: {
                id: Number.parseInt(portofolioId)
            },
        })
        delete result.id;
        res.status(200).send({ message: "Delete Successfully!", data: result, success: true })
    } catch (error) {
        console.error(error)
        res.status(500).send({ message: "Gagal menghapus portofolio", data: null, success: false })
    }
})

portofolios.put("/:idPortofolio", async (req, res) => {
    const portofolioId = req.params.idPortofolio
    const { projectName, description, status, budget, startDate, endDate } = req.body;
    try {

        const result = await prisma.portofolio.update({
            where: {
                id: Number.parseInt(portofolioId)
            },
            data: {
                project_name: projectName,
                description: description,
                budget: budget,
                status: status,
                start_date: startDate,
                end_date: endDate,
                updated_at: new Date(),
                user_id: 1
            }
        })
        delete result.id;
        res.status(200).send({ message: "Update berhasil!", data: result, success: true })
    } catch (error) {
        console.error(error)
        res.status(500).send({ message: "Gagal mengupdate portofolio", data: null, success: false })
    }
})

portofolios.patch("/:idPortofolio", async (req, res) => {
    const portofolioId = req.params.idPortofolio;
    const { projectName, description, status, budget, startDate, endDate } = req.body;

    try {
        const updateData = {};

        if (projectName) updateData.project_name = projectName;
        if (description) updateData.description = description;
        if (status) updateData.status = status;
        if (budget) updateData.budget = budget;
        if (startDate) updateData.start_date = startDate;
        if (endDate) updateData.end_date = endDate;

        // Menambahkan waktu pembaruan
        updateData.updated_at = new Date();

        // Pastikan Anda memiliki user_id yang valid, jika diperlukan.
        updateData.user_id = 1; // Misalnya, ini adalah user_id tetap

        // Melakukan update hanya pada field yang diberikan
        const result = await prisma.portofolio.update({
            where: {
                id: Number.parseInt(portofolioId),
            },
            data: updateData,
        });

        delete result.id;
        res.status(200).send({ message: "Update berhasil!", data: result, success: true });
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: "Gagal mengupdate portofolio", data: null, success: false });
    }
});

export default portofolios