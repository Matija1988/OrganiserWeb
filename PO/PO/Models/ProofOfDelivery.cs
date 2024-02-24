using System.ComponentModel;

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

        
        public int? MemberID { get; set; }
        public virtual Member? Member { get; set; }

        public int? ActivityID { get; set; }
    }
}
