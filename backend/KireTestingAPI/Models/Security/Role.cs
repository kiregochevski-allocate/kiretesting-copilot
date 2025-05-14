using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace KireTestingAPI.Models.Security
{
    [Table("Role", Schema = "Security")]
    public class Role : BaseEntity
    {
        [StringLength(255)]
        public string Description { get; set; }
        
        // Navigation properties
        public virtual ICollection<UserRole> UserRoles { get; set; }
        public virtual ICollection<RolePrivilege> RolePrivileges { get; set; }
    }
}
