using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace KireTestingAPI.Models
{
    [Table("Component")]
    public class Component : BaseEntity
    {
        [StringLength(255)]
        public string Description { get; set; }
        
        public int ProductId { get; set; }
        
        [StringLength(50)]
        public string ComponentType { get; set; }
        
        // Navigation properties
        [ForeignKey("ProductId")]
        public virtual Product Product { get; set; }
        
        public virtual ICollection<TenantComponent> TenantComponents { get; set; }
    }
}
