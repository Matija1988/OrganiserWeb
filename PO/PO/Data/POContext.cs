
using Microsoft.EntityFrameworkCore;
using PO.Models;

namespace PO.Data
{

    /// <summary>
    /// Ovo je datoteka gdje navodim datasetove i nacine spajanja u bazi
    /// This is the class that contains datasets and methods to access the DB
    /// </summary>

    public class POContext : DbContext
    {
        /// <summary>
        /// 
        /// </summary>
        /// <param name="options"></param>
        public POContext(DbContextOptions<POContext> options) : base(options)
        {

        }
        /// <summary>
        /// Projekti u bazi podataka
        /// Projects in DB
        /// </summary>

        public DbSet<Project> Projects { get; set; }

        /// <summary>
        /// 
        /// </summary>
        public DbSet<Member> members { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public DbSet<Activity> activities { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public DbSet<ProofOfDelivery> ProofOfDeliveries { get; set; }

    }
}

