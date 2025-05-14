using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace KireTestingAPI.Models
{
    [Table("Environment")]
    public class Environment : BaseEntity
    {
        [StringLength(255)]
        public string Description { get; set; }
        
        // Navigation properties
        public virtual ICollection<ProductEnvironment> ProductEnvironments { get; set; }
    }
}
