//src/components/profile/personal-info-form.tsx
import { useFormContext } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  FormField,
  FormItem,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Mail } from "lucide-react";

interface PersonalInfoFormProps {
  isLoading: boolean;
}

export function PersonalInfoForm({ isLoading }: PersonalInfoFormProps) {
  const { control, watch } = useFormContext();
  const email = watch("email");

  const formFields = [
    {
      name: "name",
      label: "Full Name",
      placeholder: "John Doe",
      type: "text",
    },
    {
      name: "phoneNumber",
      label: "Phone Number",
      placeholder: "+91 9876543210",
      type: "tel",
    },
  ];

  return (
    <Card>
      <CardContent className="space-y-6 pt-6">
        {formFields.map((field, index) => (
          <motion.div
            key={field.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <FormField
              control={control}
              name={field.name}
              render={({ field: formField }) => (
                <FormItem>
                  <Label>{field.label}</Label>
                  <FormControl>
                    <Input
                      {...formField}
                      type={field.type}
                      placeholder={field.placeholder}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </motion.div>
        ))}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <FormField
            control={control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <Label>Email Address</Label>
                <div className="flex gap-2">
                  <FormControl>
                    <div className="relative">
                      <Input {...field} type="email" disabled />
                      <Mail className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    </div>
                  </FormControl>
                  <Button variant="outline" type="button" className="shrink-0">
                    Verify Email
                  </Button>
                </div>
                <div className="mt-1.5">
                  <Badge variant="secondary" className="text-xs">
                    {email}
                  </Badge>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
        </motion.div>
      </CardContent>
    </Card>
  );
}
