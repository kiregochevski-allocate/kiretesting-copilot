using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace KireTestingAPI.Models.Security
{
    [Table("Team", Schema = "Security")]
    public class Team : BaseEntity
    {
        [StringLength(255)]
        public string Description { get; set; }
        
        // Navigation properties
        public virtual ICollection<UserTeam> UserTeams { get; set; }
        public virtual ICollection<Product> Products { get; set; }
    }
}
