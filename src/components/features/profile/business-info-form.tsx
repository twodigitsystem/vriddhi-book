//src/components/profile/business-info-form.tsx
import { useFormContext } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  FormField,
  FormItem,
  FormControl,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { motion } from "framer-motion";
import { Building2, MapPin, FileText, Hash } from "lucide-react";
import {
  indianStates,
  businessTypes,
  businessCategories,
} from "@/lib/utils/constants/constants";

interface BusinessInfoFormProps {
  isLoading: boolean;
}

export function BusinessInfoForm({ isLoading }: BusinessInfoFormProps) {
  const { control } = useFormContext();

  return (
    <Card>
      <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6">
        <motion.div
          className="col-span-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <FormField
            control={control}
            name="businessName"
            render={({ field }) => (
              <FormItem>
                <Label>Business Name</Label>
                <FormControl>
                  <div className="relative">
                    <Input
                      {...field}
                      placeholder="Your Business Name"
                      disabled={isLoading}
                    />
                    <Building2 className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <FormField
            control={control}
            name="businessType"
            render={({ field }) => (
              <FormItem>
                <Label>Business Type</Label>
                <Select
                  onValueChange={field.onChange}
                  value={field.value}
                  disabled={isLoading}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select business type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {businessTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <FormField
            control={control}
            name="businessCategory"
            render={({ field }) => (
              <FormItem>
                <Label>Business Category</Label>
                <Select
                  onValueChange={field.onChange}
                  value={field.value}
                  disabled={isLoading}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {businessCategories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <FormField
            control={control}
            name="gstin"
            render={({ field }) => (
              <FormItem>
                <Label>GSTIN</Label>
                <FormControl>
                  <div className="relative">
                    <Input
                      {...field}
                      placeholder="Enter GSTIN"
                      disabled={isLoading}
                    />
                    <Hash className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  </div>
                </FormControl>
                <FormDescription>
                  Your Goods and Services Tax Identification Number
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </motion.div>

        <motion.div
          className="col-span-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.4 }}
        >
          <FormField
            control={control}
            name="businessAddress"
            render={({ field }) => (
              <FormItem>
                <Label>Business Address</Label>
                <FormControl>
                  <div className="relative">
                    <Textarea
                      {...field}
                      placeholder="Enter business address"
                      disabled={isLoading}
                    />
                    <MapPin className="absolute right-3 top-3 text-muted-foreground h-4 w-4" />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.5 }}
        >
          <FormField
            control={control}
            name="state"
            render={({ field }) => (
              <FormItem>
                <Label>State</Label>
                <Select
                  onValueChange={field.onChange}
                  value={field.value}
                  disabled={isLoading}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select state" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {indianStates.map((state) => (
                      <SelectItem key={state} value={state}>
                        {state}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.6 }}
        >
          <FormField
            control={control}
            name="pincode"
            render={({ field }) => (
              <FormItem>
                <Label>Pincode</Label>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="Enter pincode"
                    disabled={isLoading}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </motion.div>

        <motion.div
          className="col-span-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.7 }}
        >
          <FormField
            control={control}
            name="businessDescription"
            render={({ field }) => (
              <FormItem>
                <Label>Business Description</Label>
                <FormControl>
                  <div className="relative">
                    <Textarea
                      {...field}
                      placeholder="Describe your business"
                      rows={4}
                      disabled={isLoading}
                    />
                    <FileText className="absolute right-3 top-3 text-muted-foreground h-4 w-4" />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </motion.div>
      </CardContent>
    </Card>
  );
}
