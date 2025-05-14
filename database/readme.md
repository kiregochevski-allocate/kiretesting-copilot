# Database Component

## Technology Stack
- SQL Server
- Entity Framework Core (ORM for .NET)
- Database Migrations for version control

## Development Steps
1. Define database schema/models
2. Create initial migration scripts
3. Setup connection strings
4. Include seed data for development

## Database Schema
All tables should be in singular. Using Pascal case for naming convention. Exceptions are one to many relationships where I want table with sufix Details. All tables should have Id int identity(1,1) not null primary key, Code, Name, CreatedBy, CreatedDate (default(getdate())), ModifiedDate trigger that will update the datetime. ModifiedBy
Create security schema. In that schema I want following tables: User, Role, Privilege, Team, Module.
Since this application is as catalog of all products in our company, I want tables that will collect that information. Product, Component. I also need table of all Tenants and relationship which tenant have which application and component enabled.
I need information regarding the pdocuts, I need record for each of following environments (Development, Test, Preproduction and Production) Information regarding AWS account with it's details like Name, Id, VPC etc. where this application is deployed. Also Some applications are multi tenant, some are single tenanted.

### Example Entities:
- User
- Product
- Team
- Role
- Privilege
- Component
- Environment
- etc.

## Connection Information
- Development connection string: (to be defined)
- Test connection string: (to be defined)

## Migration Commands
```bash
# Add a migration
dotnet ef migrations add InitialCreate

# Update database
dotnet ef database update
```

## Database Diagram
(Include a diagram of your database schema when ready)