import { yupResolver } from '@hookform/resolvers/yup';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

import patientInvitationSchema, {
  PatientInvitationSchema,
} from '@/schemas/PatientInvitation.schema';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export interface DoctorInvitationDialogContainerProps {
  onAction: (data: PatientInvitationSchema) => void;
}

const DoctorInvitationDialogContainer = ({
  onAction,
}: DoctorInvitationDialogContainerProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<PatientInvitationSchema>({
    defaultValues: {
      patientId: '',
    },
    resolver: yupResolver(patientInvitationSchema),
  });

  const patientId = watch('patientId');

  const handleFormSubmit = (data: PatientInvitationSchema) => {
    onAction(data);
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger render={<Button>Start Video Call</Button>} />

      <DialogContent className="max-w-md">
        <form onSubmit={handleSubmit(handleFormSubmit)}>
          <DialogHeader>
            <DialogTitle>Invite Patient</DialogTitle>
            <DialogDescription>
              Enter the patient&apos;s ID to start a video call
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 my-4">
            <div className="grid gap-2">
              <Label htmlFor="patientId">Patient ID</Label>
              <Input
                {...register('patientId')}
                id="patientId"
                placeholder="Enter patient ID"
                className={errors.patientId ? 'border-red-500' : ''}
              />
              {errors.patientId && (
                <p className="text-sm text-red-500">
                  {errors.patientId.message}
                </p>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={!patientId}>
              Invite
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default DoctorInvitationDialogContainer;
