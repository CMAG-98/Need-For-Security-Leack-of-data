export interface RolePermission {
  id: string;
  startAt: string;
  endAt: string;
  roleId: number;
  permissionId: number;
  role?: {
    id: number;
    name: string;
    description: string;
  };
  permission?: {
    id: number;
    url: string;
    method: string;
    entity: string;
  };
}