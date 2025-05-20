"use client";

import { useState } from "react";
import { Party, partySchema, PartyType } from "@/lib/validators/partySchema";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { createParty, updateParty } from "@/actions/partyActions";
import { useActionState } from "react";

interface PartyModalProps {
  isOpen: boolean;
  onClose: () => void;
  party: Party | null;
}

export default function PartyModal({
  isOpen,
  onClose,
  party,
}: PartyModalProps) {
  const [formState, setFormState] = useState({
    partyType: party?.partyType,
    name: party?.name || "",
    companyName: party?.companyName || "",
    gstin: party?.gstin || "",
    phoneNumber: party?.phoneNumber || "",
    email: party?.email || "",
    billingAddress: party?.billingAddress || "",
    shippingAddress: party?.shippingAddress || "",
    payableAmount: party?.payableAmount?.toString() ?? "0",
    receivableAmount: party?.receivableAmount?.toString() ?? "0",
  });

  const [state, formAction, isPending] = useActionState(
    (_state: any, formData: FormData) =>
      party ? updateParty(formData) : createParty(formData),
    null
  );

  const handleSubmit = () => {
    const formData = new FormData();
    Object.entries(formState).forEach(([key, value]) => {
      formData.append(key, value ?? "");
    });
    if (party?.id) formData.append("id", party.id);
    formAction(formData);
    onClose();
  };

  const partyTypeOptions = partySchema.shape.partyType.options;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{party ? "Edit Party" : "Add Party"}</DialogTitle>
        </DialogHeader>

        <form action={handleSubmit}>
          <Tabs defaultValue="basic" className="mt-4">
            <TabsList>
              <TabsTrigger value="basic">Basic Info</TabsTrigger>
              <TabsTrigger value="address">Address</TabsTrigger>
              <TabsTrigger value="finance">Finance</TabsTrigger>
            </TabsList>

            <TabsContent value="basic">
              <div className="grid gap-4 py-4">
                <div>
                  <label className="text-sm font-medium">Party Type</label>
                  <Select
                    name="partyType"
                    value={formState.partyType}
                    onValueChange={(value) =>
                      setFormState({
                        ...formState,
                        partyType: value as PartyType,
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.values(partyTypeOptions).map((type) => (
                        <SelectItem key={type} value={type}>
                          {type.charAt(0) + type.slice(1).toLowerCase()}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium">Name</label>
                  <Input
                    name="name"
                    value={formState.name}
                    onChange={(e) =>
                      setFormState({ ...formState, name: e.target.value })
                    }
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Company Name</label>
                  <Input
                    name="companyName"
                    value={formState.companyName}
                    onChange={(e) =>
                      setFormState({
                        ...formState,
                        companyName: e.target.value,
                      })
                    }
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">GSTIN</label>
                  <Input
                    name="gstin"
                    value={formState.gstin}
                    onChange={(e) =>
                      setFormState({ ...formState, gstin: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Phone Number</label>
                  <Input
                    name="phoneNumber"
                    value={formState.phoneNumber}
                    onChange={(e) =>
                      setFormState({
                        ...formState,
                        phoneNumber: e.target.value,
                      })
                    }
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Email</label>
                  <Input
                    name="email"
                    value={formState.email}
                    onChange={(e) =>
                      setFormState({ ...formState, email: e.target.value })
                    }
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="address">
              <div className="grid gap-4 py-4">
                <div>
                  <label className="text-sm font-medium">Billing Address</label>
                  <Textarea
                    name="billingAddress"
                    value={formState.billingAddress}
                    onChange={(e) =>
                      setFormState({
                        ...formState,
                        billingAddress: e.target.value,
                      })
                    }
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">
                    Shipping Address
                  </label>
                  <Textarea
                    name="shippingAddress"
                    value={formState.shippingAddress}
                    onChange={(e) =>
                      setFormState({
                        ...formState,
                        shippingAddress: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="finance">
              <div className="grid gap-4 py-4">
                <div>
                  <label className="text-sm font-medium">Payable Amount</label>
                  <Input
                    name="payableAmount"
                    type="number"
                    value={formState.payableAmount}
                    onChange={(e) =>
                      setFormState({
                        ...formState,
                        payableAmount: e.target.value,
                      })
                    }
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">
                    Receivable Amount
                  </label>
                  <Input
                    name="receivableAmount"
                    type="number"
                    value={formState.receivableAmount}
                    onChange={(e) =>
                      setFormState({
                        ...formState,
                        receivableAmount: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <DialogFooter className="mt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Saving..." : "Save"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
