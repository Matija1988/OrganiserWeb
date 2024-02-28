using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using PO.Models;

namespace PO.Data
{

    /// <summary>
    /// Ovo je datoteka gdje navodim datasetove i nacine spajanja u bazi
    /// This is the class that contains datasets and methods to access the DB
    /// </summary>

    public class POContext : IdentityDbContext
    {
        
        public POContext(DbContextOptions<POContext> options) : base(options)
        {

        }
        /// <summary>
        /// Projekti u bazi podataka
        /// Projects in DB
        /// </summary>

        public DbSet<Project> projects { get; set; }

        public DbSet<Member> members { get; set; }

        public DbSet<Activity> activities { get; set; }

        public DbSet<ProofOfDelivery> ProofOfDeliveries { get; set; }

    }
}

