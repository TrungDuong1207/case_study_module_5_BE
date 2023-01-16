import {classRoutes} from "./class.route";
import {studentRoutes} from "./student.route";
import {authRoutes} from "./auth.route";
import {teacherRoutes} from "./teacher.route";
import {subjectRoutes} from "./subject.route";
import { markRoutes } from "./mark.route";
import { checkAuth } from "../midlewares/auth.middleware";

function route(app) {
    app.use("/auth", authRoutes);

    app.use(checkAuth);

    app.use("/class", classRoutes);

    app.use("/students", studentRoutes);

    app.use("/teachers", teacherRoutes);

    app.use("/subject", subjectRoutes);

    app.use("/marks", markRoutes)
}

export default route;