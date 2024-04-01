using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace PO.Models
{
    /// <summary>
    /// POKO mapiran na bazu
    /// POCO mapped to DB
    /// </summary>
    public class Activity : Entity
    {
        /// <summary>
        /// Naziv aktivnosti
        /// NAPOMENA: Koristiti naziv iz Projektog zadatka/troskovnika
        /// PRIMJER: 
        /// 1.1. Izrada projektno tehnicke dokumentacije
        /// Activity name 
        /// ANNOTATION: Use the name of Project documentation
        /// EXAMPLE:
        /// 1.1. Creation of project and tehnical documentation
        /// </summary>

        [Required]
        public string ActivityName { get; set; }

        /// <summary>
        /// Opis aktivnosti
        /// Activity description
        /// </summary>

        public string? Description { get; set; }

        /// <summary>
        /// Planirani pocetak provedbe aktivnosti
        /// Planned activity execution start date
        /// </summary>

        [Required]
        public DateTime DateStart { get; set; }

        /// <summary>
        /// Planirani kraj provedbe aktivnosti
        /// Planned activity execition end date
        /// </summary>
        [Required]
        public DateTime DateFinish { get; set; }

        /// <summary>
        /// Dokaznice o izvrsenim aktivnostima
        /// Predstavlja dokumente koji dokazuju da je 
        /// i kako je aktivnost izvrsena
        /// Proof of executed activities
        /// Documents that prove that activity is 
        /// executed and how
        /// </summary>
        
        
        public bool? IsFinished { get; set; }

        /// <summary>
        /// Datum zavrsetka aktivnosti / Datum na koji je Narucitelj 
        /// prihvatio dokaznice o izvrsenoj aktivnosti
        /// Date on activity ended / Date on which the Client accepted
        /// the proof of delivery
        /// </summary>

        public DateTime? DateAccepted { get; set; }

        /// <summary>
        /// Projekt kojem aktivnost pripada
        /// Project the activity is associeted with
        /// </summary>

        [Required]
        [ForeignKey("projectID")]
        public Project Project { get; set; }

        public List<Member>? Members { get; set; }

    }
}
