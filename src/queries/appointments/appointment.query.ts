import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

import { ClientEnv } from '@/constants/env';

import { IAppointment } from '@/models/Appointment.model';

import { ApiResponse } from '@/typings/api';

export const getAppointments = () => {
  const url = `${ClientEnv.API_URL}/appointments`;

  return useQuery({
    queryKey: [url],
    queryFn: () => axios.get<ApiResponse<IAppointment[]>>(url),
  });
};
