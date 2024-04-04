
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

        public DbSet<User> Users { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // implementacija veze 1:n

            modelBuilder.Entity<ProofOfDelivery>().HasOne(pod => pod.Activity);
            modelBuilder.Entity<ProofOfDelivery>().HasOne(pod => pod.Member);


            modelBuilder.Entity<Activity>().HasOne(a => a.Project);


            modelBuilder.Entity<Activity>().HasMany(m => m.Members)
                .WithMany(a => a.IActivities)
                .UsingEntity<Dictionary<string, object>>("activitiesConnector",
                ac => ac.HasOne<Member>().WithMany().HasForeignKey("memberID"),
                ac => ac.HasOne<Activity>().WithMany().HasForeignKey("activityID"),
                ac => ac.ToTable("activitiesConnector")
                );

           



        }

    }
}

