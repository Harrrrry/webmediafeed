export const UserRole = {
  CREATOR: 'creator',
  GUEST: 'guest',
  RELATIVE: 'relative'
} as const;

export type UserRoleType = typeof UserRole[keyof typeof UserRole];

// Helper function to check if a role is valid
export const isValidUserRole = (role: string): role is UserRoleType => {
  return Object.values(UserRole).includes(role as UserRoleType);
};

// Helper function to get display name for role
export const getRoleDisplayName = (role: UserRoleType): string => {
  switch (role) {
    case UserRole.CREATOR:
      return 'Creator';
    case UserRole.GUEST:
      return 'Guest';
    case UserRole.RELATIVE:
      return 'Relative';
    default:
      return role;
  }
}; 