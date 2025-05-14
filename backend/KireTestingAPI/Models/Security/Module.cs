using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace KireTestingAPI.Models.Security
{
    [Table("Module", Schema = "Security")]
    public class Module : BaseEntity
    {
        [StringLength(255)]
        public string Description { get; set; }
        
        public bool IsActive { get; set; } = true;
    }
}
