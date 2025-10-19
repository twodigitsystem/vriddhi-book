// Member types

export type MemberUser = {
  id: string;
  name: string;
  email: string;
  image?: string | null;
};

export type Member = {
  id: string;
  organizationId: string;
  userId: string;
  role: string;
  createdAt: Date;
  user: MemberUser;
};

export type MemberWithDetails = Member & {
  user: MemberUser;
};

// Role options for member management
export const MEMBER_ROLES = {
  owner: "Owner",
  admin: "Admin",
  member: "Member",
} as const;

export type MemberRole = keyof typeof MEMBER_ROLES;

// Status for invitations
export const INVITATION_STATUS = {
  pending: "Pending",
  accepted: "Accepted",
  expired: "Expired",
  canceled: "Canceled",
} as const;

export type InvitationStatus = keyof typeof INVITATION_STATUS;
