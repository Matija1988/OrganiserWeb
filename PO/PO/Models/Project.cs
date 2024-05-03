using System.ComponentModel.DataAnnotations;

namespace PO.Models
{
    /// <summary>
    /// POKO mapiran na bazu
    /// POCO mapped to DB
    /// </summary>
    public class Project : Entity
    {
        /// <summary>
        /// Jedinstvena oznaka projekta 
        /// Project unique ID code
        /// </summary>

        [Required(ErrorMessage = "Unos obavezan / Mandatory input")]
        public string UniqueID { get; set; }

        /// <summary>
        /// Puni naziv projekta - U slucaju prevelike duzine moze i akronim
        /// Full project name - In case of lenght acronym is viable
        /// </summary>
        [Required(ErrorMessage = "Unos obavezan / Mandatory input")]
        public string ProjectName { get; set; }

        /// <summary>
        /// Datum kada je projekt sluzbeno poceo - provjeriti ugovor
        /// The date the project officially begun - check contract
        /// </summary>
        public DateTime DateStart { get; set; }

        /// <summary>
        /// Datum kada projekt sluzbeno zavrsava - provjeriti ugovor 
        /// za ispravnu informaciju 
        /// Ukoliko je primjenjivo provjeri anekse i unesi novi
        /// The date the project officially ends - check contract for 
        /// valid information
        /// If appliable check contract annex and enter new date 
        /// </summary>
        public DateTime DateEnd { get; set; }

        /// <summary>
        /// Oznacava je li projekt zavrsen ili ne true = zavrsen, false = u tijeku
        /// Marks project status true = finished, false = ongoing
        /// </summary>
        public bool? IsFinished { get; set; }

     
    }
}
