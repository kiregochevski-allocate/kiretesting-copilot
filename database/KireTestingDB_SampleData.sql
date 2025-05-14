-- KireTestingDB_SampleData.sql
-- SQL Script to populate the KireTestingDB with sample data for testing and development

USE KireTestingDB;
GO

PRINT 'Starting to insert sample data...';
GO

-- Security Schema Sample Data
PRINT 'Inserting Security Schema Data...';

-- Roles
INSERT INTO Security.Role (Code, Name, Description)
VALUES 
    ('DEV', 'Developer', 'Developer role with access to development environments'),
    ('QA', 'Quality Assurance', 'QA team member with testing privileges'),
    ('DEVOPS', 'DevOps Engineer', 'Infrastructure and deployment management'),
    ('PM', 'Project Manager', 'Project management and reporting access'),
    ('VIEWER', 'Viewer', 'Read-only access to system data');
GO

-- Users (Admin user already exists from schema creation)
INSERT INTO Security.[User] (Code, Name, Email, Password, IsActive)
VALUES 
    ('JSMITH', 'John Smith', 'john.smith@example.com', 'hashedpassword456', 1),
    ('MJOHNSON', 'Mary Johnson', 'mary.johnson@example.com', 'hashedpassword789', 1),
    ('RBROWN', 'Robert Brown', 'robert.brown@example.com', 'hashedpassword101', 1),
    ('LWILSON', 'Linda Wilson', 'linda.wilson@example.com', 'hashedpassword112', 1),
    ('MGARCIA', 'Michael Garcia', 'michael.garcia@example.com', 'hashedpassword131', 1),
    ('AMARTINEZ', 'Amanda Martinez', 'amanda.martinez@example.com', 'hashedpassword415', 1),
    ('TLEE', 'Thomas Lee', 'thomas.lee@example.com', 'hashedpassword161', 1),
    ('EWHITE', 'Elizabeth White', 'elizabeth.white@example.com', 'hashedpassword718', 1),
    ('DHARRIS', 'David Harris', 'david.harris@example.com', 'hashedpassword192', 1),
    ('JCLARK', 'Jennifer Clark', 'jennifer.clark@example.com', 'hashedpassword202', 1);
GO

-- Privileges
INSERT INTO Security.Privilege (Code, Name, Description)
VALUES
    ('VIEW_DASHBOARD', 'View Dashboard', 'View main application dashboard'),
    ('MANAGE_USERS', 'Manage Users', 'Create, update and delete user accounts'),
    ('MANAGE_ROLES', 'Manage Roles', 'Create, update and delete roles'),
    ('VIEW_PRODUCTS', 'View Products', 'View product information'),
    ('MANAGE_PRODUCTS', 'Manage Products', 'Create, update and delete products'),
    ('VIEW_TENANTS', 'View Tenants', 'View tenant information'),
    ('MANAGE_TENANTS', 'Manage Tenants', 'Create, update and delete tenants'),
    ('VIEW_COMPONENTS', 'View Components', 'View component information'),
    ('MANAGE_COMPONENTS', 'Manage Components', 'Create, update and delete components'),
    ('MANAGE_DEPLOYMENTS', 'Manage Deployments', 'Deploy and update environments'),
    ('VIEW_LOGS', 'View Logs', 'View system logs'),
    ('TENANT_ADMIN', 'Tenant Admin', 'Administer tenant-specific settings'),
    ('PRODUCT_ADMIN', 'Product Admin', 'Administer product-specific settings');
GO

-- Role Privilege Mapping
-- Admin role has all privileges
INSERT INTO Security.RolePrivilege (RoleId, PrivilegeId)
SELECT r.Id, p.Id
FROM Security.Role r, Security.Privilege p
WHERE r.Code = 'ADMIN';
GO

-- Developer role privileges
INSERT INTO Security.RolePrivilege (RoleId, PrivilegeId)
SELECT r.Id, p.Id
FROM Security.Role r, Security.Privilege p
WHERE r.Code = 'DEV' AND p.Code IN ('VIEW_DASHBOARD', 'VIEW_PRODUCTS', 'VIEW_TENANTS', 'VIEW_COMPONENTS', 'MANAGE_COMPONENTS', 'VIEW_LOGS');
GO

-- QA role privileges
INSERT INTO Security.RolePrivilege (RoleId, PrivilegeId)
SELECT r.Id, p.Id
FROM Security.Role r, Security.Privilege p
WHERE r.Code = 'QA' AND p.Code IN ('VIEW_DASHBOARD', 'VIEW_PRODUCTS', 'VIEW_TENANTS', 'VIEW_COMPONENTS', 'VIEW_LOGS');
GO

-- DevOps role privileges
INSERT INTO Security.RolePrivilege (RoleId, PrivilegeId)
SELECT r.Id, p.Id
FROM Security.Role r, Security.Privilege p
WHERE r.Code = 'DEVOPS' AND p.Code IN ('VIEW_DASHBOARD', 'VIEW_PRODUCTS', 'MANAGE_DEPLOYMENTS', 'VIEW_LOGS');
GO

-- Project Manager role privileges
INSERT INTO Security.RolePrivilege (RoleId, PrivilegeId)
SELECT r.Id, p.Id
FROM Security.Role r, Security.Privilege p
WHERE r.Code = 'PM' AND p.Code IN ('VIEW_DASHBOARD', 'VIEW_PRODUCTS', 'VIEW_TENANTS', 'VIEW_COMPONENTS');
GO

-- Viewer role privileges
INSERT INTO Security.RolePrivilege (RoleId, PrivilegeId)
SELECT r.Id, p.Id
FROM Security.Role r, Security.Privilege p
WHERE r.Code = 'VIEWER' AND p.Code IN ('VIEW_DASHBOARD', 'VIEW_PRODUCTS', 'VIEW_TENANTS');
GO

-- Teams
INSERT INTO Security.Team (Code, Name, Description)
VALUES
    ('CORE', 'Core Development', 'Core platform development team'),
    ('FRONTEND', 'Frontend Development', 'User interface development team'),
    ('BACKEND', 'Backend Development', 'API and service development team'),
    ('DEVOPS', 'DevOps Team', 'Infrastructure and deployment team'),
    ('QA', 'Quality Assurance', 'Testing and quality assurance team'),
    ('ANALYTICS', 'Data Analytics', 'Data analytics and reporting team');
GO

-- User Role Mapping
-- Assign roles to users
INSERT INTO Security.UserRole (UserId, RoleId)
SELECT u.Id, r.Id
FROM Security.[User] u, Security.Role r
WHERE (u.Code = 'JSMITH' AND r.Code = 'DEV')
   OR (u.Code = 'MJOHNSON' AND r.Code = 'QA')
   OR (u.Code = 'RBROWN' AND r.Code = 'DEVOPS')
   OR (u.Code = 'LWILSON' AND r.Code = 'PM')
   OR (u.Code = 'MGARCIA' AND r.Code = 'DEV')
   OR (u.Code = 'AMARTINEZ' AND r.Code = 'VIEWER')
   OR (u.Code = 'TLEE' AND r.Code = 'DEV')
   OR (u.Code = 'EWHITE' AND r.Code = 'QA')
   OR (u.Code = 'DHARRIS' AND r.Code = 'DEVOPS')
   OR (u.Code = 'JCLARK' AND r.Code = 'PM');
GO

-- Some users have multiple roles
INSERT INTO Security.UserRole (UserId, RoleId)
SELECT u.Id, r.Id
FROM Security.[User] u, Security.Role r
WHERE (u.Code = 'JSMITH' AND r.Code = 'QA')
   OR (u.Code = 'MGARCIA' AND r.Code = 'DEVOPS');
GO

-- User Team Mapping
-- Assign users to teams with some as team leads
INSERT INTO Security.UserTeam (UserId, TeamId, IsTeamLead)
SELECT u.Id, t.Id, CASE WHEN u.Code IN ('JSMITH', 'LWILSON', 'RBROWN', 'MJOHNSON', 'DHARRIS', 'EWHITE') THEN 1 ELSE 0 END
FROM Security.[User] u, Security.Team t
WHERE (u.Code = 'JSMITH' AND t.Code = 'CORE')
   OR (u.Code = 'MJOHNSON' AND t.Code = 'QA')
   OR (u.Code = 'RBROWN' AND t.Code = 'DEVOPS')
   OR (u.Code = 'LWILSON' AND t.Code = 'FRONTEND')
   OR (u.Code = 'MGARCIA' AND t.Code = 'BACKEND')
   OR (u.Code = 'AMARTINEZ' AND t.Code = 'BACKEND')
   OR (u.Code = 'TLEE' AND t.Code = 'FRONTEND')
   OR (u.Code = 'EWHITE' AND t.Code = 'QA')
   OR (u.Code = 'DHARRIS' AND t.Code = 'ANALYTICS')
   OR (u.Code = 'JCLARK' AND t.Code = 'CORE');
GO

-- Some users are in multiple teams
INSERT INTO Security.UserTeam (UserId, TeamId, IsTeamLead)
SELECT u.Id, t.Id, 0
FROM Security.[User] u, Security.Team t
WHERE (u.Code = 'JSMITH' AND t.Code = 'BACKEND')
   OR (u.Code = 'MGARCIA' AND t.Code = 'CORE');
GO

-- Modules
INSERT INTO Security.Module (Code, Name, Description, IsActive)
VALUES
    ('DASHBOARD', 'Dashboard', 'Main application dashboard', 1),
    ('USER_MGMT', 'User Management', 'User and role management', 1),
    ('PRODUCT_MGMT', 'Product Management', 'Product configuration and deployment', 1),
    ('TENANT_MGMT', 'Tenant Management', 'Tenant configuration and management', 1),
    ('COMPONENT_MGMT', 'Component Management', 'Component configuration and deployment', 1),
    ('REPORTS', 'Reports', 'Analytics and reporting module', 1),
    ('LOGS', 'System Logs', 'System logging and monitoring', 1),
    ('SETTINGS', 'System Settings', 'Application configuration', 1);
GO

-- Application Tables Sample Data
PRINT 'Inserting Application Data...';

-- AWS Accounts
INSERT INTO dbo.AwsAccount (Code, Name, AccountId, VpcId, Region, Description)
VALUES
    ('DEV_AWS', 'Development AWS Account', '123456789012', 'vpc-12345678', 'us-east-1', 'Primary development AWS account'),
    ('TEST_AWS', 'Test AWS Account', '234567890123', 'vpc-23456789', 'us-east-1', 'Testing environment AWS account'),
    ('PREPROD_AWS', 'Pre-Production AWS Account', '345678901234', 'vpc-34567890', 'us-east-1', 'Pre-production AWS account'),
    ('PROD_AWS', 'Production AWS Account', '456789012345', 'vpc-45678901', 'us-east-1', 'Production AWS account'),
    ('DR_AWS', 'Disaster Recovery AWS Account', '567890123456', 'vpc-56789012', 'us-west-2', 'Disaster recovery AWS account');
GO

-- Tenants
INSERT INTO dbo.Tenant (Code, Name, Description, IsActive)
VALUES
    ('ACME', 'Acme Corporation', 'Largest customer with multiple products', 1),
    ('GLOBEX', 'Globex Corporation', 'International corporate client', 1),
    ('INITECH', 'Initech', 'Technology services company', 1),
    ('UMBRELLA', 'Umbrella Corporation', 'Pharmaceutical company', 1),
    ('WAYNE', 'Wayne Enterprises', 'Conglomerate with diverse interests', 1),
    ('STARK', 'Stark Industries', 'Technology and defense contractor', 1),
    ('CYBERDYNE', 'Cyberdyne Systems', 'AI and robotics research', 1),
    ('OSCORP', 'Oscorp Industries', 'Scientific research and manufacturing', 1),
    ('INACTIVE_TENANT', 'Inactive Tenant Example', 'Example of inactive tenant', 0);
GO

-- Products (with Team assignments)
INSERT INTO dbo.Product (Code, Name, Description, Version, IsMultiTenant, TeamId)
SELECT 'CORE_PLATFORM', 'Core Platform', 'Main enterprise platform', '2.0.0', 1, t.Id
FROM Security.Team t
WHERE t.Code = 'CORE';
GO

INSERT INTO dbo.Product (Code, Name, Description, Version, IsMultiTenant, TeamId)
SELECT 'ANALYTICS_SUITE', 'Analytics Suite', 'Business intelligence and reporting tools', '1.5.0', 1, t.Id
FROM Security.Team t
WHERE t.Code = 'ANALYTICS';
GO

INSERT INTO dbo.Product (Code, Name, Description, Version, IsMultiTenant, TeamId)
SELECT 'CRM_SYSTEM', 'Customer Relationship Management', 'Customer management and sales tools', '3.1.0', 1, t.Id
FROM Security.Team t
WHERE t.Code = 'FRONTEND';
GO

INSERT INTO dbo.Product (Code, Name, Description, Version, IsMultiTenant, TeamId)
SELECT 'INVENTORY_SYSTEM', 'Inventory Management', 'Inventory tracking and management', '2.2.1', 1, t.Id
FROM Security.Team t
WHERE t.Code = 'BACKEND';
GO

INSERT INTO dbo.Product (Code, Name, Description, Version, IsMultiTenant, TeamId)
SELECT 'HR_PORTAL', 'HR Portal', 'Human resources management platform', '1.0.3', 1, t.Id
FROM Security.Team t
WHERE t.Code = 'FRONTEND';
GO

INSERT INTO dbo.Product (Code, Name, Description, Version, IsMultiTenant, TeamId)
SELECT 'ACME_CUSTOM', 'Acme Custom Solution', 'Custom solution for Acme Corporation', '1.2.0', 0, t.Id
FROM Security.Team t
WHERE t.Code = 'CORE';
GO

INSERT INTO dbo.Product (Code, Name, Description, Version, IsMultiTenant, TeamId)
SELECT 'GLOBEX_CUSTOM', 'Globex Custom Solution', 'Custom solution for Globex Corporation', '1.0.1', 0, t.Id
FROM Security.Team t
WHERE t.Code = 'BACKEND';
GO

-- Components
-- Core Platform Components
INSERT INTO dbo.Component (Code, Name, Description, ProductId, ComponentType)
SELECT 'CORE_API', 'Core API', 'Main API for Core Platform', p.Id, 'API'
FROM dbo.Product p
WHERE p.Code = 'CORE_PLATFORM';
GO

INSERT INTO dbo.Component (Code, Name, Description, ProductId, ComponentType)
SELECT 'CORE_UI', 'Core UI', 'User Interface for Core Platform', p.Id, 'UI'
FROM dbo.Product p
WHERE p.Code = 'CORE_PLATFORM';
GO

INSERT INTO dbo.Component (Code, Name, Description, ProductId, ComponentType)
SELECT 'CORE_DB', 'Core Database', 'Database for Core Platform', p.Id, 'Database'
FROM dbo.Product p
WHERE p.Code = 'CORE_PLATFORM';
GO

INSERT INTO dbo.Component (Code, Name, Description, ProductId, ComponentType)
SELECT 'CORE_AUTH', 'Authentication Service', 'Authentication for Core Platform', p.Id, 'Service'
FROM dbo.Product p
WHERE p.Code = 'CORE_PLATFORM';
GO

-- Analytics Suite Components
INSERT INTO dbo.Component (Code, Name, Description, ProductId, ComponentType)
SELECT 'ANALYTICS_API', 'Analytics API', 'API for Analytics Suite', p.Id, 'API'
FROM dbo.Product p
WHERE p.Code = 'ANALYTICS_SUITE';
GO

INSERT INTO dbo.Component (Code, Name, Description, ProductId, ComponentType)
SELECT 'ANALYTICS_UI', 'Analytics UI', 'User Interface for Analytics Suite', p.Id, 'UI'
FROM dbo.Product p
WHERE p.Code = 'ANALYTICS_SUITE';
GO

INSERT INTO dbo.Component (Code, Name, Description, ProductId, ComponentType)
SELECT 'ANALYTICS_DB', 'Analytics Database', 'Database for Analytics Suite', p.Id, 'Database'
FROM dbo.Product p
WHERE p.Code = 'ANALYTICS_SUITE';
GO

INSERT INTO dbo.Component (Code, Name, Description, ProductId, ComponentType)
SELECT 'ANALYTICS_ETL', 'ETL Service', 'ETL Processing for Analytics Suite', p.Id, 'Service'
FROM dbo.Product p
WHERE p.Code = 'ANALYTICS_SUITE';
GO

-- CRM System Components
INSERT INTO dbo.Component (Code, Name, Description, ProductId, ComponentType)
SELECT 'CRM_API', 'CRM API', 'API for CRM System', p.Id, 'API'
FROM dbo.Product p
WHERE p.Code = 'CRM_SYSTEM';
GO

INSERT INTO dbo.Component (Code, Name, Description, ProductId, ComponentType)
SELECT 'CRM_UI', 'CRM UI', 'User Interface for CRM System', p.Id, 'UI'
FROM dbo.Product p
WHERE p.Code = 'CRM_SYSTEM';
GO

INSERT INTO dbo.Component (Code, Name, Description, ProductId, ComponentType)
SELECT 'CRM_DB', 'CRM Database', 'Database for CRM System', p.Id, 'Database'
FROM dbo.Product p
WHERE p.Code = 'CRM_SYSTEM';
GO

-- Inventory System Components
INSERT INTO dbo.Component (Code, Name, Description, ProductId, ComponentType)
SELECT 'INV_API', 'Inventory API', 'API for Inventory System', p.Id, 'API'
FROM dbo.Product p
WHERE p.Code = 'INVENTORY_SYSTEM';
GO

INSERT INTO dbo.Component (Code, Name, Description, ProductId, ComponentType)
SELECT 'INV_UI', 'Inventory UI', 'User Interface for Inventory System', p.Id, 'UI'
FROM dbo.Product p
WHERE p.Code = 'INVENTORY_SYSTEM';
GO

INSERT INTO dbo.Component (Code, Name, Description, ProductId, ComponentType)
SELECT 'INV_DB', 'Inventory Database', 'Database for Inventory System', p.Id, 'Database'
FROM dbo.Product p
WHERE p.Code = 'INVENTORY_SYSTEM';
GO

INSERT INTO dbo.Component (Code, Name, Description, ProductId, ComponentType)
SELECT 'INV_SCANNER', 'Inventory Scanner Service', 'Barcode Scanner Integration', p.Id, 'Service'
FROM dbo.Product p
WHERE p.Code = 'INVENTORY_SYSTEM';
GO

-- HR Portal Components
INSERT INTO dbo.Component (Code, Name, Description, ProductId, ComponentType)
SELECT 'HR_API', 'HR API', 'API for HR Portal', p.Id, 'API'
FROM dbo.Product p
WHERE p.Code = 'HR_PORTAL';
GO

INSERT INTO dbo.Component (Code, Name, Description, ProductId, ComponentType)
SELECT 'HR_UI', 'HR UI', 'User Interface for HR Portal', p.Id, 'UI'
FROM dbo.Product p
WHERE p.Code = 'HR_PORTAL';
GO

INSERT INTO dbo.Component (Code, Name, Description, ProductId, ComponentType)
SELECT 'HR_DB', 'HR Database', 'Database for HR Portal', p.Id, 'Database'
FROM dbo.Product p
WHERE p.Code = 'HR_PORTAL';
GO

-- Custom Product Components
INSERT INTO dbo.Component (Code, Name, Description, ProductId, ComponentType)
SELECT 'ACME_CUSTOM_UI', 'ACME Custom UI', 'Custom UI for Acme Corporation', p.Id, 'UI'
FROM dbo.Product p
WHERE p.Code = 'ACME_CUSTOM';
GO

INSERT INTO dbo.Component (Code, Name, Description, ProductId, ComponentType)
SELECT 'ACME_CUSTOM_API', 'ACME Custom API', 'Custom API for Acme Corporation', p.Id, 'API'
FROM dbo.Product p
WHERE p.Code = 'ACME_CUSTOM';
GO

INSERT INTO dbo.Component (Code, Name, Description, ProductId, ComponentType)
SELECT 'GLOBEX_CUSTOM_UI', 'Globex Custom UI', 'Custom UI for Globex Corporation', p.Id, 'UI'
FROM dbo.Product p
WHERE p.Code = 'GLOBEX_CUSTOM';
GO

INSERT INTO dbo.Component (Code, Name, Description, ProductId, ComponentType)
SELECT 'GLOBEX_CUSTOM_API', 'Globex Custom API', 'Custom API for Globex Corporation', p.Id, 'API'
FROM dbo.Product p
WHERE p.Code = 'GLOBEX_CUSTOM';
GO

-- Product Environment Deployments
-- Core Platform Deployments
INSERT INTO dbo.ProductEnvironment (ProductId, EnvironmentId, AwsAccountId, DeploymentUrl, Status, DeployedOn)
SELECT p.Id, e.Id, a.Id, 
       'https://core-dev.kireapp.com', 'Deployed', DATEADD(DAY, -60, GETDATE())
FROM dbo.Product p, dbo.Environment e, dbo.AwsAccount a
WHERE p.Code = 'CORE_PLATFORM' AND e.Code = 'DEV' AND a.Code = 'DEV_AWS';
GO

INSERT INTO dbo.ProductEnvironment (ProductId, EnvironmentId, AwsAccountId, DeploymentUrl, Status, DeployedOn)
SELECT p.Id, e.Id, a.Id, 
       'https://core-test.kireapp.com', 'Deployed', DATEADD(DAY, -45, GETDATE())
FROM dbo.Product p, dbo.Environment e, dbo.AwsAccount a
WHERE p.Code = 'CORE_PLATFORM' AND e.Code = 'TEST' AND a.Code = 'TEST_AWS';
GO

INSERT INTO dbo.ProductEnvironment (ProductId, EnvironmentId, AwsAccountId, DeploymentUrl, Status, DeployedOn)
SELECT p.Id, e.Id, a.Id, 
       'https://core-preprod.kireapp.com', 'Deployed', DATEADD(DAY, -30, GETDATE())
FROM dbo.Product p, dbo.Environment e, dbo.AwsAccount a
WHERE p.Code = 'CORE_PLATFORM' AND e.Code = 'PREPROD' AND a.Code = 'PREPROD_AWS';
GO

INSERT INTO dbo.ProductEnvironment (ProductId, EnvironmentId, AwsAccountId, DeploymentUrl, Status, DeployedOn)
SELECT p.Id, e.Id, a.Id, 
       'https://core.kireapp.com', 'Deployed', DATEADD(DAY, -15, GETDATE())
FROM dbo.Product p, dbo.Environment e, dbo.AwsAccount a
WHERE p.Code = 'CORE_PLATFORM' AND e.Code = 'PROD' AND a.Code = 'PROD_AWS';
GO

-- Analytics Suite Deployments
INSERT INTO dbo.ProductEnvironment (ProductId, EnvironmentId, AwsAccountId, DeploymentUrl, Status, DeployedOn)
SELECT p.Id, e.Id, a.Id, 
       'https://analytics-dev.kireapp.com', 'Deployed', DATEADD(DAY, -50, GETDATE())
FROM dbo.Product p, dbo.Environment e, dbo.AwsAccount a
WHERE p.Code = 'ANALYTICS_SUITE' AND e.Code = 'DEV' AND a.Code = 'DEV_AWS';
GO

INSERT INTO dbo.ProductEnvironment (ProductId, EnvironmentId, AwsAccountId, DeploymentUrl, Status, DeployedOn)
SELECT p.Id, e.Id, a.Id, 
       'https://analytics-test.kireapp.com', 'Deployed', DATEADD(DAY, -40, GETDATE())
FROM dbo.Product p, dbo.Environment e, dbo.AwsAccount a
WHERE p.Code = 'ANALYTICS_SUITE' AND e.Code = 'TEST' AND a.Code = 'TEST_AWS';
GO

INSERT INTO dbo.ProductEnvironment (ProductId, EnvironmentId, AwsAccountId, DeploymentUrl, Status, DeployedOn)
SELECT p.Id, e.Id, a.Id, 
       'https://analytics-preprod.kireapp.com', 'Deployed', DATEADD(DAY, -25, GETDATE())
FROM dbo.Product p, dbo.Environment e, dbo.AwsAccount a
WHERE p.Code = 'ANALYTICS_SUITE' AND e.Code = 'PREPROD' AND a.Code = 'PREPROD_AWS';
GO

INSERT INTO dbo.ProductEnvironment (ProductId, EnvironmentId, AwsAccountId, DeploymentUrl, Status, DeployedOn)
SELECT p.Id, e.Id, a.Id, 
       'https://analytics.kireapp.com', 'Deployed', DATEADD(DAY, -10, GETDATE())
FROM dbo.Product p, dbo.Environment e, dbo.AwsAccount a
WHERE p.Code = 'ANALYTICS_SUITE' AND e.Code = 'PROD' AND a.Code = 'PROD_AWS';
GO

-- CRM System Deployments
INSERT INTO dbo.ProductEnvironment (ProductId, EnvironmentId, AwsAccountId, DeploymentUrl, Status, DeployedOn)
SELECT p.Id, e.Id, a.Id, 
       'https://crm-dev.kireapp.com', 'Deployed', DATEADD(DAY, -55, GETDATE())
FROM dbo.Product p, dbo.Environment e, dbo.AwsAccount a
WHERE p.Code = 'CRM_SYSTEM' AND e.Code = 'DEV' AND a.Code = 'DEV_AWS';
GO

INSERT INTO dbo.ProductEnvironment (ProductId, EnvironmentId, AwsAccountId, DeploymentUrl, Status, DeployedOn)
SELECT p.Id, e.Id, a.Id, 
       'https://crm-test.kireapp.com', 'Deployed', DATEADD(DAY, -35, GETDATE())
FROM dbo.Product p, dbo.Environment e, dbo.AwsAccount a
WHERE p.Code = 'CRM_SYSTEM' AND e.Code = 'TEST' AND a.Code = 'TEST_AWS';
GO

INSERT INTO dbo.ProductEnvironment (ProductId, EnvironmentId, AwsAccountId, DeploymentUrl, Status)
SELECT p.Id, e.Id, a.Id, 
       'https://crm-preprod.kireapp.com', 'Not Deployed'
FROM dbo.Product p, dbo.Environment e, dbo.AwsAccount a
WHERE p.Code = 'CRM_SYSTEM' AND e.Code = 'PREPROD' AND a.Code = 'PREPROD_AWS';
GO

INSERT INTO dbo.ProductEnvironment (ProductId, EnvironmentId, AwsAccountId, DeploymentUrl, Status)
SELECT p.Id, e.Id, a.Id, 
       'https://crm.kireapp.com', 'Not Deployed'
FROM dbo.Product p, dbo.Environment e, dbo.AwsAccount a
WHERE p.Code = 'CRM_SYSTEM' AND e.Code = 'PROD' AND a.Code = 'PROD_AWS';
GO

-- Inventory System Deployments (only dev environment)
INSERT INTO dbo.ProductEnvironment (ProductId, EnvironmentId, AwsAccountId, DeploymentUrl, Status, DeployedOn)
SELECT p.Id, e.Id, a.Id, 
       'https://inventory-dev.kireapp.com', 'Deployed', DATEADD(DAY, -20, GETDATE())
FROM dbo.Product p, dbo.Environment e, dbo.AwsAccount a
WHERE p.Code = 'INVENTORY_SYSTEM' AND e.Code = 'DEV' AND a.Code = 'DEV_AWS';
GO

-- HR Portal (no deployments yet)

-- Tenant Product Associations
-- Acme has access to all multi-tenant products and their custom product
INSERT INTO dbo.TenantProduct (TenantId, ProductId, IsActive, ActivatedDate)
SELECT t.Id, p.Id, 1, DATEADD(DAY, -90, GETDATE())
FROM dbo.Tenant t, dbo.Product p
WHERE t.Code = 'ACME' AND p.IsMultiTenant = 1;
GO

INSERT INTO dbo.TenantProduct (TenantId, ProductId, IsActive, ActivatedDate)
SELECT t.Id, p.Id, 1, DATEADD(DAY, -60, GETDATE())
FROM dbo.Tenant t, dbo.Product p
WHERE t.Code = 'ACME' AND p.Code = 'ACME_CUSTOM';
GO

-- Globex has access to Core, Analytics, CRM and their custom product
INSERT INTO dbo.TenantProduct (TenantId, ProductId, IsActive, ActivatedDate)
SELECT t.Id, p.Id, 1, DATEADD(DAY, -85, GETDATE())
FROM dbo.Tenant t, dbo.Product p
WHERE t.Code = 'GLOBEX' AND p.Code IN ('CORE_PLATFORM', 'ANALYTICS_SUITE', 'CRM_SYSTEM');
GO

INSERT INTO dbo.TenantProduct (TenantId, ProductId, IsActive, ActivatedDate)
SELECT t.Id, p.Id, 1, DATEADD(DAY, -55, GETDATE())
FROM dbo.Tenant t, dbo.Product p
WHERE t.Code = 'GLOBEX' AND p.Code = 'GLOBEX_CUSTOM';
GO

-- Initech has access to Core, Analytics and Inventory
INSERT INTO dbo.TenantProduct (TenantId, ProductId, IsActive, ActivatedDate)
SELECT t.Id, p.Id, 1, DATEADD(DAY, -80, GETDATE())
FROM dbo.Tenant t, dbo.Product p
WHERE t.Code = 'INITECH' AND p.Code IN ('CORE_PLATFORM', 'ANALYTICS_SUITE', 'INVENTORY_SYSTEM');
GO

-- Umbrella has access to Core and CRM
INSERT INTO dbo.TenantProduct (TenantId, ProductId, IsActive, ActivatedDate)
SELECT t.Id, p.Id, 1, DATEADD(DAY, -75, GETDATE())
FROM dbo.Tenant t, dbo.Product p
WHERE t.Code = 'UMBRELLA' AND p.Code IN ('CORE_PLATFORM', 'CRM_SYSTEM');
GO

-- Wayne has access to Core only
INSERT INTO dbo.TenantProduct (TenantId, ProductId, IsActive, ActivatedDate)
SELECT t.Id, p.Id, 1, DATEADD(DAY, -70, GETDATE())
FROM dbo.Tenant t, dbo.Product p
WHERE t.Code = 'WAYNE' AND p.Code = 'CORE_PLATFORM';
GO

-- Stark has access to Core and Analytics but Analytics is deactivated
INSERT INTO dbo.TenantProduct (TenantId, ProductId, IsActive, ActivatedDate, DeactivatedDate)
SELECT t.Id, p.Id, 1, DATEADD(DAY, -100, GETDATE()), NULL
FROM dbo.Tenant t, dbo.Product p
WHERE t.Code = 'STARK' AND p.Code = 'CORE_PLATFORM';
GO

INSERT INTO dbo.TenantProduct (TenantId, ProductId, IsActive, ActivatedDate, DeactivatedDate)
SELECT t.Id, p.Id, 0, DATEADD(DAY, -100, GETDATE()), DATEADD(DAY, -30, GETDATE())
FROM dbo.Tenant t, dbo.Product p
WHERE t.Code = 'STARK' AND p.Code = 'ANALYTICS_SUITE';
GO

-- Cyberdyne has access to Core, CRM and HR Portal
INSERT INTO dbo.TenantProduct (TenantId, ProductId, IsActive, ActivatedDate)
SELECT t.Id, p.Id, 1, DATEADD(DAY, -65, GETDATE())
FROM dbo.Tenant t, dbo.Product p
WHERE t.Code = 'CYBERDYNE' AND p.Code IN ('CORE_PLATFORM', 'CRM_SYSTEM', 'HR_PORTAL');
GO

-- Oscorp has access to Core and Analytics
INSERT INTO dbo.TenantProduct (TenantId, ProductId, IsActive, ActivatedDate)
SELECT t.Id, p.Id, 1, DATEADD(DAY, -60, GETDATE())
FROM dbo.Tenant t, dbo.Product p
WHERE t.Code = 'OSCORP' AND p.Code IN ('CORE_PLATFORM', 'ANALYTICS_SUITE');
GO

-- Tenant Component Associations
-- We'll enable specific components for a few tenants as examples

-- Enable all Core Platform components for Acme
INSERT INTO dbo.TenantComponent (TenantId, ComponentId, IsActive, ActivatedDate)
SELECT t.Id, c.Id, 1, DATEADD(DAY, -90, GETDATE())
FROM dbo.Tenant t, dbo.Component c, dbo.Product p
WHERE t.Code = 'ACME' AND c.ProductId = p.Id AND p.Code = 'CORE_PLATFORM';
GO

-- Enable all Analytics Suite components for Acme
INSERT INTO dbo.TenantComponent (TenantId, ComponentId, IsActive, ActivatedDate)
SELECT t.Id, c.Id, 1, DATEADD(DAY, -90, GETDATE())
FROM dbo.Tenant t, dbo.Component c, dbo.Product p
WHERE t.Code = 'ACME' AND c.ProductId = p.Id AND p.Code = 'ANALYTICS_SUITE';
GO

-- Enable specific CRM components for Globex
INSERT INTO dbo.TenantComponent (TenantId, ComponentId, IsActive, ActivatedDate)
SELECT t.Id, c.Id, 1, DATEADD(DAY, -85, GETDATE())
FROM dbo.Tenant t, dbo.Component c
WHERE t.Code = 'GLOBEX' AND c.Code IN ('CRM_API', 'CRM_UI');
GO

-- Enable all Core Platform components for Initech except Auth
INSERT INTO dbo.TenantComponent (TenantId, ComponentId, IsActive, ActivatedDate)
SELECT t.Id, c.Id, 1, DATEADD(DAY, -80, GETDATE())
FROM dbo.Tenant t, dbo.Component c
WHERE t.Code = 'INITECH' AND c.Code IN ('CORE_API', 'CORE_UI', 'CORE_DB');
GO

-- Enable only Inventory API for Umbrella (not the UI)
INSERT INTO dbo.TenantComponent (TenantId, ComponentId, IsActive, ActivatedDate)
SELECT t.Id, c.Id, 1, DATEADD(DAY, -75, GETDATE())
FROM dbo.Tenant t, dbo.Component c
WHERE t.Code = 'UMBRELLA' AND c.Code = 'INV_API';
GO

PRINT 'Sample data inserted successfully.';
GO
