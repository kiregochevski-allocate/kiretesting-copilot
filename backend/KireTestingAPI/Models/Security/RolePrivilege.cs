using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace KireTestingAPI.Models.Security
{
    [Table("RolePrivilege", Schema = "Security")]
    public class RolePrivilege
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }
        
        public int RoleId { get; set; }
        public int PrivilegeId { get; set; }
        
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
        [ForeignKey("RoleId")]
        public virtual Role Role { get; set; }
        
        [ForeignKey("PrivilegeId")]
        public virtual Privilege Privilege { get; set; }
    }
}
