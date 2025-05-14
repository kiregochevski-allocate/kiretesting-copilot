using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace KireTestingAPI.Models.Security
{
    [Table("UserTeam", Schema = "Security")]
    public class UserTeam
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }
        
        public int UserId { get; set; }
        public int TeamId { get; set; }
        
        public bool IsTeamLead { get; set; }
        
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
        [ForeignKey("UserId")]
        public virtual User User { get; set; }
        
        [ForeignKey("TeamId")]
        public virtual Team Team { get; set; }
    }
}
