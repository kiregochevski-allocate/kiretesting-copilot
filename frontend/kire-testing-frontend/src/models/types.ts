export interface BaseEntity {
  id: number;
  code: string;
  name: string;
  createdBy: string;
  createdDate: string;
  modifiedBy: string;
  modifiedDate: string;
}

export interface Product extends BaseEntity {
  description: string;
  version: string;
  isMultiTenant: boolean;
  teamId?: number;
  team?: Team;
  components?: Component[];
  productEnvironments?: ProductEnvironment[];
  tenantProducts?: TenantProduct[];
}

export interface Tenant extends BaseEntity {
  description: string;
  isActive: boolean;
  tenantProducts?: TenantProduct[];
  tenantComponents?: TenantComponent[];
}

export interface Component extends BaseEntity {
  description: string;
  productId: number;
  componentType: string;
  product?: Product;
  tenantComponents?: TenantComponent[];
}

export interface Environment extends BaseEntity {
  description: string;
  productEnvironments?: ProductEnvironment[];
}

export interface Team extends BaseEntity {
  description?: string;
}

export interface ProductEnvironment {
  id: number;
  productId: number;
  environmentId: number;
  product?: Product;
  environment?: Environment;
}

export interface TenantProduct {
  id: number;
  tenantId: number;
  productId: number;
  tenant?: Tenant;
  product?: Product;
}

export interface TenantComponent {
  id: number;
  tenantId: number;
  componentId: number;
  tenant?: Tenant;
  component?: Component;
}
