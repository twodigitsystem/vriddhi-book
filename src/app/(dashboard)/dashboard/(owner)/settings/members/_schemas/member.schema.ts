import { z } from "zod";

// Schema for updating member role
export const updateMemberRoleSchema = z.object({
  memberId: z.string().min(1, "Member ID is required"),
  role: z.string().min(1, "Role is required"),
  organizationId: z.string().min(1, "Organization ID is required"),
});

export type UpdateMemberRoleSchemaType = z.infer<typeof updateMemberRoleSchema>;

// Schema for inviting a new member
export const inviteMemberSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  role: z.string().min(1, "Role is required"),
  organizationId: z.string().min(1, "Organization ID is required"),
});

export type InviteMemberSchemaType = z.infer<typeof inviteMemberSchema>;

// Schema for removing member(s)
export const removeMemberSchema = z.object({
  memberIds: z.array(z.string()).min(1, "At least one member must be selected"),
  organizationId: z.string().min(1, "Organization ID is required"),
});

export type RemoveMemberSchemaType = z.infer<typeof removeMemberSchema>;
