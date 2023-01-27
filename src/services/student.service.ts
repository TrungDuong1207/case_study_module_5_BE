import axios from "axios";
import { studentRepo } from "../models/repository/repository";
import { Like } from "typeorm";

const firebase = require('../configs/firebase');

export class studentService {
    static async queryAllStudents(req, res) {
        const students = await studentRepo.createQueryBuilder("student")
            .innerJoinAndSelect("student.studyClass", "studyClass")
            .getMany();
        return students;
    }


    static async findStudentById(req, res) {
        let id = req.params.id;
        let student = await studentRepo.findOneBy({ id: id });
        return student;
    }

    static async getStudent(req, res) {
        const id = req.params.id;
        const student = await studentRepo.createQueryBuilder("student")
            .innerJoinAndSelect("student.studyClass", "studyClass")
            .where("student.id = :id", { id: id })
            .getOne();
        return student;

    }

    static async addOneStudent(req, res) {
        if (!req.file) {
            return res.status(400).send("Error: No files found")
        }

        let imageNameFireBase = req.file.originalname + Date.now();

        const blob = firebase.bucket.file("student-upload/" + imageNameFireBase);

        const blobWriter = blob.createWriteStream({
            metadata: {
                contentType: req.file.mimetype
            }
        })

        blobWriter.on('error', (err) => {
            console.log(err)
        })

        blobWriter.end(req.file.buffer);

        blobWriter.on('finish', async () => {

            let apiImg = await axios.get(`https://firebasestorage.googleapis.com/v0/b/student-manager-md5.appspot.com/o/student-upload%2F${imageNameFireBase}`);

            let imageToken = apiImg.data.downloadTokens;

            let imageName = `https://firebasestorage.googleapis.com/v0/b/student-manager-md5.appspot.com/o/student-upload%2F${imageNameFireBase}?alt=media&token=${imageToken}`;

            let studentCreate = { ...req.body, image: imageName }
            let student = await studentRepo.create(studentCreate);
            await studentRepo.save(student);
            res.status(200).json(studentCreate)
        })



    }

    static async deleteOneStudent(req, res) {
        const id = req.params.id;
        let student = await studentRepo.findOneBy({ id: id });
        let image = student.image;
        
        const baseUrl = "https://firebasestorage.googleapis.com/v0/b/student-manager-md5.appspot.com/o/";

        let imagePath: string = image.replace(baseUrl, "");

        const indexOfEndPath = imagePath.indexOf("?");

        imagePath = imagePath.substring(0, indexOfEndPath);

        imagePath = imagePath.replace("%2F", "/");

        console.log(imagePath);
        
        await firebase.bucket.file(imagePath).delete();
        
        await studentRepo.delete({ id: id });
    }

    static async editStudent(req, res) {
        const id = req.params.id;
        let student = req.body;
        await studentRepo.update(id, student);
    }

    static async searchStudent(req, res) {
        const values = req.query.name;
        const students = await studentRepo.findBy({
            studentName: Like(`%${values}%`),
        })
        return students;
    }


}