using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace KireTestingAPI.Models
{
    [Table("Tenant")]
    public class Tenant : BaseEntity
    {
        [StringLength(255)]
        public string Description { get; set; }
        
        public bool IsActive { get; set; } = true;
        
        // Navigation properties
        public virtual ICollection<TenantProduct> TenantProducts { get; set; }
        public virtual ICollection<TenantComponent> TenantComponents { get; set; }
    }
}
