using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace KireTestingAPI.Models
{
    [Table("AwsAccount")]
    public class AwsAccount : BaseEntity
    {
        [Required]
        [StringLength(20)]
        public string AccountId { get; set; }
        
        [StringLength(50)]
        public string VpcId { get; set; }
        
        [StringLength(50)]
        public string Region { get; set; }
        
        [StringLength(255)]
        public string Description { get; set; }
        
        // Navigation properties
        public virtual ICollection<ProductEnvironment> ProductEnvironments { get; set; }
    }
}
