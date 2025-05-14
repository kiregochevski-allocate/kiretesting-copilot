using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace KireTestingAPI.Models
{
    public abstract class BaseEntity
    {
        public BaseEntity()
        {
            Code = string.Empty;
            Name = string.Empty;
            CreatedBy = "System";
            CreatedDate = DateTime.Now;
            ModifiedBy = "System";
            ModifiedDate = DateTime.Now;
        }
        
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }
        
        [Required]
        [StringLength(50)]
        public string Code { get; set; }
        
        [Required]
        [StringLength(100)]
        public string Name { get; set; }
        
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
    }
}
