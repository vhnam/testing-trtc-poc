import { useQuery } from '@tanstack/react-query';
import axios, { AxiosError } from 'axios';

import { API_ENDPOINTS } from '@/constants/api';
import { ClientEnv } from '@/constants/env';

import { IAppointment } from '@/models/Appointment.model';

import { ApiResponse } from '@/typings/api';

export const appointmentKeys = {
  all: [`${ClientEnv.API_URL}/appointments`] as const,
  lists: () => [...appointmentKeys.all, 'list'] as const,
  list: (filters: string) => [...appointmentKeys.lists(), { filters }] as const,
  details: () => [...appointmentKeys.all, 'detail'] as const,
  detail: (id: string) => [...appointmentKeys.details(), id] as const,
};

export interface AppointmentError {
  message: string;
  status?: number;
}

export const fetchAppointments = async (): Promise<IAppointment[]> => {
  try {
    const response = await axios.get<ApiResponse<IAppointment[]>>(
      API_ENDPOINTS.appointments.list()
    );
    return response.data.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError;
      const errorMessage =
        axiosError.response?.data &&
        typeof axiosError.response.data === 'object' &&
        'message' in axiosError.response.data
          ? (axiosError.response.data as { message: string }).message
          : axiosError.message;
      throw new Error(`Failed to fetch appointments: ${errorMessage}`);
    }
    throw new Error('An unexpected error occurred while fetching appointments');
  }
};

export const useAppointments = () => {
  return useQuery({
    queryKey: appointmentKeys.lists(),
    queryFn: fetchAppointments,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
    retry: (failureCount, error) => {
      // Don't retry on 4xx errors
      if (error instanceof Error && error.message.includes('4')) {
        return false;
      }
      return failureCount < 3;
    },
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
  });
};

export const useAppointment = (id: string) => {
  return useQuery({
    queryKey: appointmentKeys.detail(id),
    queryFn: async () => {
      const response = await axios.get<ApiResponse<IAppointment>>(
        API_ENDPOINTS.appointments.detail(id)
      );
      return response.data.data;
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};
