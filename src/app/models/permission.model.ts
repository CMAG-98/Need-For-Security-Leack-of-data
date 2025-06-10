export interface Permission {
  id: number;
  url: string;
  method: string;
  has_permission?: boolean;
  entity: string;
}