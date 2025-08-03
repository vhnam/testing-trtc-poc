import * as yup from "yup";

const schema = yup.object().shape({
  patientId: yup.string().required("Patient ID is required"),
});

export type PatientInvitationSchema = yup.InferType<typeof schema>;

export default schema;
