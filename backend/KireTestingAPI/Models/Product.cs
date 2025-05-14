using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using KireTestingAPI.Models.Security;

namespace KireTestingAPI.Models
{
    [Table("Product")]
    public class Product : BaseEntity
    {
        [StringLength(255)]
        public string Description { get; set; }
        
        [StringLength(50)]
        public string Version { get; set; }
        
        public bool IsMultiTenant { get; set; } = false;
        
        public int? TeamId { get; set; }
        
        // Navigation properties
        [ForeignKey("TeamId")]
        public virtual Team Team { get; set; }
        
        public virtual ICollection<Component> Components { get; set; }
        public virtual ICollection<ProductEnvironment> ProductEnvironments { get; set; }
        public virtual ICollection<TenantProduct> TenantProducts { get; set; }
    }
}
