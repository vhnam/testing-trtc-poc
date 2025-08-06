import { IUser } from './User.model';

export type AppointmentStatus = 'pending' | 'started' | 'done';

export interface IAppointment {
  id: string;
  patientId: string;
  registeredAt: string;
  description?: string;
  status: AppointmentStatus;
  patient: IUser;
}
