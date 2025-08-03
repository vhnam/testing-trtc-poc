import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { roles } from "@/constants/role";
import loginSchema, { type LoginSchema } from "@/schemas/Login.schema";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm, Controller } from "react-hook-form";

export interface LoginFormProps {
  onLogin: (data: LoginSchema) => void;
}

const LoginForm = ({ onLogin }: LoginFormProps) => {
  const { register, handleSubmit, control, formState: { errors } } = useForm<LoginSchema>({
    defaultValues: {
      userId: "",
      role: roles[0].value,
    },
    resolver: yupResolver(loginSchema),
  });

  console.log(errors);

  return (
    <form onSubmit={handleSubmit(onLogin)} className="space-y-6">
      <div>
        <Label htmlFor="userId" className="block text-sm/6 font-medium">
          User Id
        </Label>
        <div className="mt-2 mb-6">
          <Input
            id="userId"
            type="text"
            required
            placeholder="Please enter the userId you want to create/login"
            {...register("userId")}
          />
        </div>

        <div>
          <Label className="block text-sm/6 font-medium">Your role</Label>
          <div className="mt-2">
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
                    <div key={role.value} className="flex items-center space-x-2">
                      <RadioGroupItem value={role.value} id={role.id} />
                      <Label htmlFor={role.id}>{role.text}</Label>
                    </div>
                  ))}
                </RadioGroup>
              )}
            />
          </div>
        </div>
      </div>

      <div>
        <Button className="w-full" type="submit">
          Create / Login
        </Button>
      </div>
    </form>
  );
};

export default LoginForm;
