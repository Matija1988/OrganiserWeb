using System.ComponentModel.DataAnnotations;

namespace PO.Models
{

    /// <summary>
    /// POKO mapiran na bazu
    /// POCO mapped to DB
    /// </summary>
    public class Member : Entity
    {
        

        /// <summary>
        /// Ime korisnika
        /// Users first name
        /// </summary>
        [Required]
        public string FirstName { get; set; }

        /// <summary>
        /// Prezime korisnika
        /// Users last name
        /// </summary>
        [Required]
        public string LastName { get; set; }
        
        /// <summary>
        /// Korisnikov naziv za login
        /// Users login username
        /// </summary>
        
        [Required]
        public string  Username { get; set; }

        /// <summary>
        /// Korisnikova sifra
        /// Users password
        /// </summary>

        [Required]
        public string Password { get; set; }

        /// <summary>
        /// Ovo oznacava je li korisnik voditelj tima 
        /// sto mu dodijeluje ovlasti za manipulaciju 
        /// korisnicima i brisanje unosa
        /// This represents is a user a team leader
        /// a status that gives him authority 
        /// to manipulate other users and delete entries
        /// </summary>

        [Required]
        public bool IsTeamLeader { get; set; }

    }
}
