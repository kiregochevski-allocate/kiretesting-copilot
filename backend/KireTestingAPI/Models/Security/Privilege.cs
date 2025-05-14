using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace KireTestingAPI.Models.Security
{
    [Table("Privilege", Schema = "Security")]
    public class Privilege : BaseEntity
    {
        [StringLength(255)]
        public string Description { get; set; }
        
        // Navigation properties
        public virtual ICollection<RolePrivilege> RolePrivileges { get; set; }
    }
}
