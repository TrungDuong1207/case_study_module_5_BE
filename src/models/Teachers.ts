import {
    Column,
    Entity,
    PrimaryGeneratedColumn,
    OneToMany,
    ManyToOne

} from "typeorm";
import { TeacherDetails } from "./TeacherDetails";
import { Subjects } from "./Subjects";
export type GenderType = "male" | "female" ;
@Entity()
export class Teachers {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({type:'varchar'})
    name: string;

    @Column({type:'enum' , enum:[ 'male', 'female' ]})
    gender: GenderType;

    @Column()
    phone:number

    @OneToMany(() => TeacherDetails, (teacherDetail) => teacherDetail.teacher)
    teacherDetails: TeacherDetails[];

    @ManyToOne (() => Subjects, subject => subject.teachers)
    subject: Subjects;
}
