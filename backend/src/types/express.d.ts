import { IAdmin } from "../models/admin.model.js";
import { IRole } from "../models/role.model.js";

export interface PopulatedAdmin extends Omit<IAdmin, "role"> {
    role: IRole;
}

declare global {
    namespace Express {
        interface Request {
            user?: PopulatedAdmin;
        }
    }
}
