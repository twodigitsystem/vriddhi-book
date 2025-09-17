"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";

interface EntityFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  title: string;
  description: string;
  fields: {
    name: string;
    label: string;
    type: "text" | "textarea" | "number" | "switch";
  }[];
  defaultValues?: Record<string, any>;
}

import { useEffect } from "react";

export function EntityForm({
  isOpen,
  onClose,
  onSubmit,
  title,
  description,
  fields,
  defaultValues,
}: EntityFormProps) {
  const formSchema = z.object(
    fields.reduce(
      (acc, field) => {
        if (field.type === "text" || field.type === "textarea") {
          acc[field.name] = z.string().optional();
        } else if (field.type === "number") {
          acc[field.name] = z.number().optional();
        } else if (field.type === "switch") {
          acc[field.name] = z.boolean().optional();
        }
        return acc;
      },
      {} as Record<string, z.ZodTypeAny>
    )
  );

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: defaultValues || {},
  });

  useEffect(() => {
    if (isOpen && defaultValues) {
      form.reset(defaultValues);
    } else if (!isOpen) {
      form.reset({});
    }
  }, [isOpen, defaultValues, form]);

  const handleSubmit = (data: z.infer<typeof formSchema>) => {
    onSubmit(data);
    form.reset();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <form
          onSubmit={form.handleSubmit(handleSubmit)}
          className="grid gap-4 py-4"
        >
          {fields.map((field) => (
            <div
              key={field.name}
              className="grid grid-cols-4 items-center gap-4"
            >
              {field.type === "switch" ? (
                <>
                  <Label htmlFor={field.name} className="col-span-3">
                    {field.label}
                  </Label>
                  <Switch
                    id={field.name}
                    checked={form.watch(field.name) as boolean}
                    onCheckedChange={(value) =>
                      form.setValue(field.name, value)
                    }
                  />
                </>
              ) : (
                <>
                  <Label htmlFor={field.name} className="text-right">
                    {field.label}
                  </Label>
                  {field.type === "textarea" ? (
                    <Textarea
                      id={field.name}
                      {...form.register(field.name)}
                      className="col-span-3"
                    />
                  ) : (
                    <Input
                      id={field.name}
                      type={field.type}
                      {...form.register(field.name, {
                        valueAsNumber: field.type === "number",
                      })}
                      className="col-span-3"
                    />
                  )}
                </>
              )}
            </div>
          ))}
          <DialogFooter>
            <Button type="submit">Save changes</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
