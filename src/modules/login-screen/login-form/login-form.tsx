import { yupResolver } from '@hookform/resolvers/yup';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import { Controller, useForm } from 'react-hook-form';

import { roles } from '@/constants/role';

import loginSchema, { type LoginSchema } from '@/schemas/login.schema';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Skeleton } from '@/components/ui/skeleton';

const SettingsConfigurationDialogTrigger = dynamic(
  () => import('@/components/settings-configuration-dialog-trigger'),
  {
    ssr: false,
    loading: () => <Skeleton className="w-full h-8.5" />,
  }
);

export interface LoginFormProps {
  onLogin: (data: LoginSchema) => void;
}

const LoginForm = ({ onLogin }: LoginFormProps) => {
  const router = useRouter();
  const { register, handleSubmit, control } = useForm<LoginSchema>({
    defaultValues: {
      userId: '',
      role: roles[0].value,
    },
    resolver: yupResolver(loginSchema),
  });

  return (
    <Card>
      <CardContent>
        <form onSubmit={handleSubmit(onLogin)} className="space-y-6">
          <div>
            <Label
              htmlFor="userId"
              className="block text-sm/6 font-medium mb-2"
            >
              User Id
            </Label>
            <div className="mb-4">
              <Input
                id="userId"
                type="text"
                required
                placeholder="Please enter the User Id you want to proceed"
                {...register('userId')}
              />
            </div>

            <div>
              <Label className="block text-sm/6 font-medium mb-2">
                Your role
              </Label>
              <Controller
                name="role"
                control={control}
                render={({ field }) => (
                  <RadioGroup
                    value={field.value}
                    onValueChange={field.onChange}
                    defaultValue={roles[0].value}
                  >
                    {roles.map((role) => (
                      <div
                        key={role.value}
                        className="flex items-center space-x-2"
                      >
                        <RadioGroupItem value={role.value} id={role.id} />
                        <Label htmlFor={role.id}>{role.text}</Label>
                      </div>
                    ))}
                  </RadioGroup>
                )}
              />
            </div>
          </div>
          <div className="space-y-3">
            <Button className="w-full" type="submit">
              Proceed to Consultation Room
            </Button>
            <SettingsConfigurationDialogTrigger isSupportVirtualBackground />
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default LoginForm;
