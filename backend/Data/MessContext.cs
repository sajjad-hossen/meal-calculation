using Microsoft.EntityFrameworkCore;
using Backend.Models;

namespace Backend.Data
{
    public class MessContext : DbContext
    {
        public MessContext(DbContextOptions<MessContext> options) : base(options) { }

        public DbSet<User> Users { get; set; }
        public DbSet<Deposit> Deposits { get; set; }
        public DbSet<MealEntry> Meals { get; set; }
        public DbSet<BazarCost> BazarCosts { get; set; }
        public DbSet<ExtraCost> ExtraCosts { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // Configure relationships if needed, e.g.
            // modelBuilder.Entity<Deposit>()
            //    .HasOne(d => d.User)
            //    .WithMany()
            //    .HasForeignKey(d => d.UserId);
            
            // Decimal precision
            modelBuilder.Entity<Deposit>().Property(p => p.Amount).HasColumnType("decimal(18,2)");
            modelBuilder.Entity<BazarCost>().Property(p => p.Amount).HasColumnType("decimal(18,2)");
            modelBuilder.Entity<ExtraCost>().Property(p => p.Amount).HasColumnType("decimal(18,2)");
        }
    }
}
