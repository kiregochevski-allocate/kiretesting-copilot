-- KireTestingDB_Creation.sql
-- SQL Script to create the database schema for Kire Testing Application

-- Create Database if it doesn't exist
IF NOT EXISTS (SELECT name FROM master.dbo.sysdatabases WHERE name = N'KireTestingDB')
BEGIN
    CREATE DATABASE KireTestingDB;
END
GO

USE KireTestingDB;
GO

-- Check if the security schema exists and create it if not
IF NOT EXISTS (SELECT schema_name FROM information_schema.schemata WHERE schema_name = 'Security')
BEGIN
    EXEC('CREATE SCHEMA Security');
END
GO

-- Create Common ModifiedDate trigger function
CREATE OR ALTER FUNCTION dbo.GetCurrentUser()
RETURNS NVARCHAR(100)
AS
BEGIN
    RETURN SYSTEM_USER;
END
GO

-- Standard Tables with Common Fields

-- Security Schema Tables
-- User Table
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'Security.User') AND type in (N'U'))
BEGIN
    CREATE TABLE Security.User (
        Id INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
        Code NVARCHAR(50) NOT NULL UNIQUE,
        Name NVARCHAR(100) NOT NULL,
        Email NVARCHAR(100) NOT NULL UNIQUE,
        Password NVARCHAR(255) NOT NULL, -- Should be stored securely in production
        IsActive BIT NOT NULL DEFAULT 1,
        CreatedBy NVARCHAR(100) NOT NULL DEFAULT dbo.GetCurrentUser(),
        CreatedDate DATETIME NOT NULL DEFAULT GETDATE(),
        ModifiedBy NVARCHAR(100) NOT NULL DEFAULT dbo.GetCurrentUser(),
        ModifiedDate DATETIME NOT NULL DEFAULT GETDATE()
    );
END
GO

-- Role Table
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'Security.Role') AND type in (N'U'))
BEGIN
    CREATE TABLE Security.Role (
        Id INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
        Code NVARCHAR(50) NOT NULL UNIQUE,
        Name NVARCHAR(100) NOT NULL,
        Description NVARCHAR(255) NULL,
        CreatedBy NVARCHAR(100) NOT NULL DEFAULT dbo.GetCurrentUser(),
        CreatedDate DATETIME NOT NULL DEFAULT GETDATE(),
        ModifiedBy NVARCHAR(100) NOT NULL DEFAULT dbo.GetCurrentUser(),
        ModifiedDate DATETIME NOT NULL DEFAULT GETDATE()
    );
END
GO

-- User Role Mapping (Many-to-Many)
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'Security.UserRole') AND type in (N'U'))
BEGIN
    CREATE TABLE Security.UserRole (
        Id INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
        UserId INT NOT NULL,
        RoleId INT NOT NULL,
        CreatedBy NVARCHAR(100) NOT NULL DEFAULT dbo.GetCurrentUser(),
        CreatedDate DATETIME NOT NULL DEFAULT GETDATE(),
        ModifiedBy NVARCHAR(100) NOT NULL DEFAULT dbo.GetCurrentUser(),
        ModifiedDate DATETIME NOT NULL DEFAULT GETDATE(),
        CONSTRAINT FK_UserRole_User FOREIGN KEY (UserId) REFERENCES Security.User(Id),
        CONSTRAINT FK_UserRole_Role FOREIGN KEY (RoleId) REFERENCES Security.Role(Id),
        CONSTRAINT UQ_UserRole UNIQUE (UserId, RoleId)
    );
END
GO

-- Privilege Table
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'Security.Privilege') AND type in (N'U'))
BEGIN
    CREATE TABLE Security.Privilege (
        Id INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
        Code NVARCHAR(50) NOT NULL UNIQUE,
        Name NVARCHAR(100) NOT NULL,
        Description NVARCHAR(255) NULL,
        CreatedBy NVARCHAR(100) NOT NULL DEFAULT dbo.GetCurrentUser(),
        CreatedDate DATETIME NOT NULL DEFAULT GETDATE(),
        ModifiedBy NVARCHAR(100) NOT NULL DEFAULT dbo.GetCurrentUser(),
        ModifiedDate DATETIME NOT NULL DEFAULT GETDATE()
    );
END
GO

-- Role Privilege Mapping (Many-to-Many)
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'Security.RolePrivilege') AND type in (N'U'))
BEGIN
    CREATE TABLE Security.RolePrivilege (
        Id INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
        RoleId INT NOT NULL,
        PrivilegeId INT NOT NULL,
        CreatedBy NVARCHAR(100) NOT NULL DEFAULT dbo.GetCurrentUser(),
        CreatedDate DATETIME NOT NULL DEFAULT GETDATE(),
        ModifiedBy NVARCHAR(100) NOT NULL DEFAULT dbo.GetCurrentUser(),
        ModifiedDate DATETIME NOT NULL DEFAULT GETDATE(),
        CONSTRAINT FK_RolePrivilege_Role FOREIGN KEY (RoleId) REFERENCES Security.Role(Id),
        CONSTRAINT FK_RolePrivilege_Privilege FOREIGN KEY (PrivilegeId) REFERENCES Security.Privilege(Id),
        CONSTRAINT UQ_RolePrivilege UNIQUE (RoleId, PrivilegeId)
    );
END
GO

-- Team Table
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'Security.Team') AND type in (N'U'))
BEGIN
    CREATE TABLE Security.Team (
        Id INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
        Code NVARCHAR(50) NOT NULL UNIQUE,
        Name NVARCHAR(100) NOT NULL,
        Description NVARCHAR(255) NULL,
        CreatedBy NVARCHAR(100) NOT NULL DEFAULT dbo.GetCurrentUser(),
        CreatedDate DATETIME NOT NULL DEFAULT GETDATE(),
        ModifiedBy NVARCHAR(100) NOT NULL DEFAULT dbo.GetCurrentUser(),
        ModifiedDate DATETIME NOT NULL DEFAULT GETDATE()
    );
END
GO

-- User Team Mapping (Many-to-Many)
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'Security.UserTeam') AND type in (N'U'))
BEGIN
    CREATE TABLE Security.UserTeam (
        Id INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
        UserId INT NOT NULL,
        TeamId INT NOT NULL,
        IsTeamLead BIT NOT NULL DEFAULT 0,
        CreatedBy NVARCHAR(100) NOT NULL DEFAULT dbo.GetCurrentUser(),
        CreatedDate DATETIME NOT NULL DEFAULT GETDATE(),
        ModifiedBy NVARCHAR(100) NOT NULL DEFAULT dbo.GetCurrentUser(),
        ModifiedDate DATETIME NOT NULL DEFAULT GETDATE(),
        CONSTRAINT FK_UserTeam_User FOREIGN KEY (UserId) REFERENCES Security.User(Id),
        CONSTRAINT FK_UserTeam_Team FOREIGN KEY (TeamId) REFERENCES Security.Team(Id),
        CONSTRAINT UQ_UserTeam UNIQUE (UserId, TeamId)
    );
END
GO

-- Module Table
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'Security.Module') AND type in (N'U'))
BEGIN
    CREATE TABLE Security.Module (
        Id INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
        Code NVARCHAR(50) NOT NULL UNIQUE,
        Name NVARCHAR(100) NOT NULL,
        Description NVARCHAR(255) NULL,
        IsActive BIT NOT NULL DEFAULT 1,
        CreatedBy NVARCHAR(100) NOT NULL DEFAULT dbo.GetCurrentUser(),
        CreatedDate DATETIME NOT NULL DEFAULT GETDATE(),
        ModifiedBy NVARCHAR(100) NOT NULL DEFAULT dbo.GetCurrentUser(),
        ModifiedDate DATETIME NOT NULL DEFAULT GETDATE()
    );
END
GO

-- Application Tables
-- Environment Table
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'dbo.Environment') AND type in (N'U'))
BEGIN
    CREATE TABLE dbo.Environment (
        Id INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
        Code NVARCHAR(50) NOT NULL UNIQUE,
        Name NVARCHAR(100) NOT NULL,
        Description NVARCHAR(255) NULL,
        CreatedBy NVARCHAR(100) NOT NULL DEFAULT dbo.GetCurrentUser(),
        CreatedDate DATETIME NOT NULL DEFAULT GETDATE(),
        ModifiedBy NVARCHAR(100) NOT NULL DEFAULT dbo.GetCurrentUser(),
        ModifiedDate DATETIME NOT NULL DEFAULT GETDATE()
    );
END
GO

-- AWS Account Table
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'dbo.AwsAccount') AND type in (N'U'))
BEGIN
    CREATE TABLE dbo.AwsAccount (
        Id INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
        Code NVARCHAR(50) NOT NULL UNIQUE,
        Name NVARCHAR(100) NOT NULL,
        AccountId NVARCHAR(20) NOT NULL UNIQUE,
        VpcId NVARCHAR(50) NULL,
        Region NVARCHAR(50) NULL,
        Description NVARCHAR(255) NULL,
        CreatedBy NVARCHAR(100) NOT NULL DEFAULT dbo.GetCurrentUser(),
        CreatedDate DATETIME NOT NULL DEFAULT GETDATE(),
        ModifiedBy NVARCHAR(100) NOT NULL DEFAULT dbo.GetCurrentUser(),
        ModifiedDate DATETIME NOT NULL DEFAULT GETDATE()
    );
END
GO

-- Tenant Table
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'dbo.Tenant') AND type in (N'U'))
BEGIN
    CREATE TABLE dbo.Tenant (
        Id INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
        Code NVARCHAR(50) NOT NULL UNIQUE,
        Name NVARCHAR(100) NOT NULL,
        Description NVARCHAR(255) NULL,
        IsActive BIT NOT NULL DEFAULT 1,
        CreatedBy NVARCHAR(100) NOT NULL DEFAULT dbo.GetCurrentUser(),
        CreatedDate DATETIME NOT NULL DEFAULT GETDATE(),
        ModifiedBy NVARCHAR(100) NOT NULL DEFAULT dbo.GetCurrentUser(),
        ModifiedDate DATETIME NOT NULL DEFAULT GETDATE()
    );
END
GO

-- Product Table
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'dbo.Product') AND type in (N'U'))
BEGIN
    CREATE TABLE dbo.Product (
        Id INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
        Code NVARCHAR(50) NOT NULL UNIQUE,
        Name NVARCHAR(100) NOT NULL,
        Description NVARCHAR(255) NULL,
        Version NVARCHAR(50) NULL,
        IsMultiTenant BIT NOT NULL DEFAULT 0,
        TeamId INT NULL,
        CreatedBy NVARCHAR(100) NOT NULL DEFAULT dbo.GetCurrentUser(),
        CreatedDate DATETIME NOT NULL DEFAULT GETDATE(),
        ModifiedBy NVARCHAR(100) NOT NULL DEFAULT dbo.GetCurrentUser(),
        ModifiedDate DATETIME NOT NULL DEFAULT GETDATE(),
        CONSTRAINT FK_Product_Team FOREIGN KEY (TeamId) REFERENCES Security.Team(Id)
    );
END
GO

-- Component Table
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'dbo.Component') AND type in (N'U'))
BEGIN
    CREATE TABLE dbo.Component (
        Id INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
        Code NVARCHAR(50) NOT NULL UNIQUE,
        Name NVARCHAR(100) NOT NULL,
        Description NVARCHAR(255) NULL,
        ProductId INT NOT NULL,
        ComponentType NVARCHAR(50) NULL, -- e.g., API, UI, Database, etc.
        CreatedBy NVARCHAR(100) NOT NULL DEFAULT dbo.GetCurrentUser(),
        CreatedDate DATETIME NOT NULL DEFAULT GETDATE(),
        ModifiedBy NVARCHAR(100) NOT NULL DEFAULT dbo.GetCurrentUser(),
        ModifiedDate DATETIME NOT NULL DEFAULT GETDATE(),
        CONSTRAINT FK_Component_Product FOREIGN KEY (ProductId) REFERENCES dbo.Product(Id)
    );
END
GO

-- Product Environment Deployment Table
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'dbo.ProductEnvironment') AND type in (N'U'))
BEGIN
    CREATE TABLE dbo.ProductEnvironment (
        Id INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
        ProductId INT NOT NULL,
        EnvironmentId INT NOT NULL,
        AwsAccountId INT NULL,
        DeploymentUrl NVARCHAR(255) NULL,
        Status NVARCHAR(50) NOT NULL DEFAULT 'Not Deployed', -- e.g., Deployed, Not Deployed, Decommissioned
        DeployedOn DATETIME NULL,
        CreatedBy NVARCHAR(100) NOT NULL DEFAULT dbo.GetCurrentUser(),
        CreatedDate DATETIME NOT NULL DEFAULT GETDATE(),
        ModifiedBy NVARCHAR(100) NOT NULL DEFAULT dbo.GetCurrentUser(),
        ModifiedDate DATETIME NOT NULL DEFAULT GETDATE(),
        CONSTRAINT FK_ProductEnvironment_Product FOREIGN KEY (ProductId) REFERENCES dbo.Product(Id),
        CONSTRAINT FK_ProductEnvironment_Environment FOREIGN KEY (EnvironmentId) REFERENCES dbo.Environment(Id),
        CONSTRAINT FK_ProductEnvironment_AwsAccount FOREIGN KEY (AwsAccountId) REFERENCES dbo.AwsAccount(Id),
        CONSTRAINT UQ_ProductEnvironment UNIQUE (ProductId, EnvironmentId)
    );
END
GO

-- Tenant Product Mapping (which tenant has which products)
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'dbo.TenantProduct') AND type in (N'U'))
BEGIN
    CREATE TABLE dbo.TenantProduct (
        Id INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
        TenantId INT NOT NULL,
        ProductId INT NOT NULL,
        IsActive BIT NOT NULL DEFAULT 1,
        ActivatedDate DATETIME NOT NULL DEFAULT GETDATE(),
        DeactivatedDate DATETIME NULL,
        CreatedBy NVARCHAR(100) NOT NULL DEFAULT dbo.GetCurrentUser(),
        CreatedDate DATETIME NOT NULL DEFAULT GETDATE(),
        ModifiedBy NVARCHAR(100) NOT NULL DEFAULT dbo.GetCurrentUser(),
        ModifiedDate DATETIME NOT NULL DEFAULT GETDATE(),
        CONSTRAINT FK_TenantProduct_Tenant FOREIGN KEY (TenantId) REFERENCES dbo.Tenant(Id),
        CONSTRAINT FK_TenantProduct_Product FOREIGN KEY (ProductId) REFERENCES dbo.Product(Id),
        CONSTRAINT UQ_TenantProduct UNIQUE (TenantId, ProductId)
    );
END
GO

-- Tenant Component Mapping (which tenant has which components enabled)
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'dbo.TenantComponent') AND type in (N'U'))
BEGIN
    CREATE TABLE dbo.TenantComponent (
        Id INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
        TenantId INT NOT NULL,
        ComponentId INT NOT NULL,
        IsActive BIT NOT NULL DEFAULT 1,
        ActivatedDate DATETIME NOT NULL DEFAULT GETDATE(),
        DeactivatedDate DATETIME NULL,
        CreatedBy NVARCHAR(100) NOT NULL DEFAULT dbo.GetCurrentUser(),
        CreatedDate DATETIME NOT NULL DEFAULT GETDATE(),
        ModifiedBy NVARCHAR(100) NOT NULL DEFAULT dbo.GetCurrentUser(),
        ModifiedDate DATETIME NOT NULL DEFAULT GETDATE(),
        CONSTRAINT FK_TenantComponent_Tenant FOREIGN KEY (TenantId) REFERENCES dbo.Tenant(Id),
        CONSTRAINT FK_TenantComponent_Component FOREIGN KEY (ComponentId) REFERENCES dbo.Component(Id),
        CONSTRAINT UQ_TenantComponent UNIQUE (TenantId, ComponentId)
    );
END
GO

-- Create triggers for automatically updating ModifiedDate
-- User Table Trigger
CREATE OR ALTER TRIGGER Security.TR_User_Update
ON Security.User
AFTER UPDATE
AS
BEGIN
    SET NOCOUNT ON;
    UPDATE u
    SET 
        ModifiedDate = GETDATE(), 
        ModifiedBy = dbo.GetCurrentUser()
    FROM Security.User u
    INNER JOIN inserted i ON u.Id = i.Id;
END
GO

-- Role Table Trigger
CREATE OR ALTER TRIGGER Security.TR_Role_Update
ON Security.Role
AFTER UPDATE
AS
BEGIN
    SET NOCOUNT ON;
    UPDATE r
    SET 
        ModifiedDate = GETDATE(), 
        ModifiedBy = dbo.GetCurrentUser()
    FROM Security.Role r
    INNER JOIN inserted i ON r.Id = i.Id;
END
GO

-- Create similar triggers for all other tables
-- (Omitting all triggers for brevity, but in production would create for all tables)

-- Seed some initial data
-- Environment data
INSERT INTO dbo.Environment (Code, Name, Description)
VALUES 
    ('DEV', 'Development', 'Development Environment'),
    ('TEST', 'Test', 'Testing Environment'),
    ('PREPROD', 'Pre-Production', 'Pre-Production Environment'),
    ('PROD', 'Production', 'Production Environment');
GO

-- Create an admin role and user
INSERT INTO Security.Role (Code, Name, Description)
VALUES ('ADMIN', 'Administrator', 'Full system access');
GO

INSERT INTO Security.User (Code, Name, Email, Password, IsActive)
VALUES ('ADMIN', 'System Administrator', 'admin@example.com', 'hashedpassword123', 1);
GO

-- Insert admin role to user
INSERT INTO Security.UserRole (UserId, RoleId)
SELECT u.Id, r.Id
FROM Security.User u, Security.Role r
WHERE u.Code = 'ADMIN' AND r.Code = 'ADMIN';
GO

-- Create indexes for better performance
-- Indexes on foreign keys
CREATE INDEX IX_Component_ProductId ON dbo.Component(ProductId);
CREATE INDEX IX_ProductEnvironment_ProductId ON dbo.ProductEnvironment(ProductId);
CREATE INDEX IX_ProductEnvironment_EnvironmentId ON dbo.ProductEnvironment(EnvironmentId);
CREATE INDEX IX_TenantProduct_TenantId ON dbo.TenantProduct(TenantId);
CREATE INDEX IX_TenantProduct_ProductId ON dbo.TenantProduct(ProductId);
CREATE INDEX IX_TenantComponent_TenantId ON dbo.TenantComponent(TenantId);
CREATE INDEX IX_TenantComponent_ComponentId ON dbo.TenantComponent(ComponentId);
GO

-- Indexes for commonly used filters
CREATE INDEX IX_Product_IsMultiTenant ON dbo.Product(IsMultiTenant);
CREATE INDEX IX_Tenant_IsActive ON dbo.Tenant(IsActive);
GO

-- Output success message
PRINT 'KireTestingDB database schema created successfully.';
GO
