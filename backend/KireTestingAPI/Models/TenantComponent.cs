using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace KireTestingAPI.Models
{
    [Table("TenantComponent")]
    public class TenantComponent
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }
        
        public int TenantId { get; set; }
        public int ComponentId { get; set; }
        
        public bool IsActive { get; set; } = true;
        public DateTime ActivatedDate { get; set; } = DateTime.Now;
        public DateTime? DeactivatedDate { get; set; }
        
        [Required]
        [StringLength(100)]
        public string CreatedBy { get; set; }
        
        [Required]
        public DateTime CreatedDate { get; set; }
        
        [Required]
        [StringLength(100)]
        public string ModifiedBy { get; set; }
        
        [Required]
        public DateTime ModifiedDate { get; set; }
        
        // Navigation properties
        [ForeignKey("TenantId")]
        public virtual Tenant Tenant { get; set; }
        
        [ForeignKey("ComponentId")]
        public virtual Component Component { get; set; }
    }
}
