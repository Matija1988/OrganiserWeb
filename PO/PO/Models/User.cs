using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace PO.Models
{
    public class User : Entity
    {
        public string? Email { get; set; }
        public string? Password {  get; set; }
    }
}
