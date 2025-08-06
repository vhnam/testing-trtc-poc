'use client';

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import Link from 'next/link';

import { formatDateTime } from '@/utils/datetime';

import { AppointmentStatus, IAppointment } from '@/models/Appointment.model';

import { Badge, BadgeVariant } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface AppointmentsTableProps {
  data: IAppointment[];
}

const Status: Record<AppointmentStatus, BadgeVariant> = {
  pending: 'default',
  started: 'warning',
  done: 'success',
};

const columns: ColumnDef<IAppointment>[] = [
  {
    accessorKey: 'patient.name',
    header: 'Patient name',
  },
  {
    accessorKey: 'description',
    header: 'Description',
  },
  {
    accessorKey: 'registeredAt',
    header: 'Registered at',
    accessorFn: (appointment) => formatDateTime(appointment.registeredAt),
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ getValue }) => (
      <Badge variant={Status[getValue<AppointmentStatus>()] as BadgeVariant}>
        {getValue() as string}
      </Badge>
    ),
  },
  {
    accessorKey: 'id',
    header: '',
    cell: ({ getValue }) => (
      <Button asChild variant="outline">
        <Link href={`/dashboard/appointments/${getValue<string>()}`}>
          Enter room
        </Link>
      </Button>
    ),
  },
];

const AppointmentsTable = ({ data }: AppointmentsTableProps) => {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="overflow-hidden rounded-md border">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && 'selected'}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default AppointmentsTable;
