import { Role } from "../stroll-enums/role";

interface IRoleUtility {
  isAdmin: (roles: Role[]) => boolean;
}

export const RoleUtility: IRoleUtility = {
  isAdmin: (roles: Role[]): boolean => {
    return roles.includes(Role.Admin);
  }
}