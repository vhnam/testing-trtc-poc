import { roles } from "@/constants/role";
import * as yup from "yup";

const schema = yup.object().shape({
  userId: yup.string().required("User ID is required"),
  role: yup
    .string()
    .oneOf(roles.map((role) => role.value))
    .required("Role is required"),
});

export type LoginSchema = yup.InferType<typeof schema>;

export default schema;
