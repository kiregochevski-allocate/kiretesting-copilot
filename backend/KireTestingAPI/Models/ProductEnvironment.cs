using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace KireTestingAPI.Models
{
    [Table("ProductEnvironment")]
    public class ProductEnvironment
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }
        
        public int ProductId { get; set; }
        public int EnvironmentId { get; set; }
        public int? AwsAccountId { get; set; }
        
        [StringLength(255)]
        public string DeploymentUrl { get; set; }
        
        [Required]
        [StringLength(50)]
        public string Status { get; set; } = "Not Deployed";
        
        public DateTime? DeployedOn { get; set; }
        
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
        [ForeignKey("ProductId")]
        public virtual Product Product { get; set; }
        
        [ForeignKey("EnvironmentId")]
        public virtual Environment Environment { get; set; }
        
        [ForeignKey("AwsAccountId")]
        public virtual AwsAccount AwsAccount { get; set; }
    }
}
