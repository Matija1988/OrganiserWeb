using System.ComponentModel;
using System.ComponentModel.DataAnnotations.Schema;

namespace PO.Models
{
    public class ProofOfDelivery : Entity
    {
        /// <summary>
        /// Naziv dokumenta 
        /// Document name
        /// </summary>
        public string DocumentName { get; set; }

        /// <summary>
        /// Lokacija dokumenta 
        /// Naziv projekta + naziv aktivnosti
        /// Document location
        /// Project name + activity name
        /// </summary>

        public string? Location { get; set; }

        /// <summary>
        /// Datum stvaranja dokumenta 
        /// Date the document was created on
        /// </summary>
        public DateTime? DateCreated { get; set; }

        /// <summary>
        /// Tko je stvorio dokument
        /// Who created the document
        /// </summary>

        [ForeignKey("memberID")]
        public Member? MemberID { get; set; }

        [ForeignKey("activityID")]
        public Activity ActivityID { get; set; }
    }
}
