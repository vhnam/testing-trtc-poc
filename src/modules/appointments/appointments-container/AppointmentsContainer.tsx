import { useAppointments } from '@/queries/appointments/appointment.query';

import AppointmentsTable from '../appointments-table';

const AppointmentsContainer = () => {
  const { data } = useAppointments();

  return (
    <div className="py-12 max-w-[1200px] mx-auto">
      <div className="mb-6">
        <h1 className="scroll-m-20 text-4xl font-semibold tracking-tight sm:text-3xl xl:text-4xl">
          Appointments
        </h1>
      </div>
      <AppointmentsTable data={data ?? []} />
    </div>
  );
};

export default AppointmentsContainer;
