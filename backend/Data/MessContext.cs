using Microsoft.EntityFrameworkCore;
using Backend.Models;
using Backend.Services;

namespace Backend.Data
{
    public class MessContext : DbContext
    {
        private readonly ITenantService _tenantService;
        public int? CurrentMessId => _tenantService.GetMessId();

        public MessContext(DbContextOptions<MessContext> options, ITenantService tenantService) : base(options) 
        {
            _tenantService = tenantService;
        }

        public DbSet<User> Users { get; set; }
        public DbSet<Mess> Messes { get; set; }
        public DbSet<Deposit> Deposits { get; set; }
        public DbSet<MealEntry> Meals { get; set; }
        public DbSet<BazarCost> BazarCosts { get; set; }
        public DbSet<PaymentRequest> PaymentRequests { get; set; }
        public DbSet<SystemSettings> SystemSettings { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // Global Query Filters
            modelBuilder.Entity<User>().HasQueryFilter(u => u.MessId == CurrentMessId);
            modelBuilder.Entity<Deposit>().HasQueryFilter(d => d.MessId == CurrentMessId);
            modelBuilder.Entity<MealEntry>().HasQueryFilter(m => m.MessId == CurrentMessId);
            modelBuilder.Entity<BazarCost>().HasQueryFilter(b => b.MessId == CurrentMessId);

            // Decimal precision
            modelBuilder.Entity<Deposit>().Property(p => p.Amount).HasColumnType("decimal(18,2)");
            modelBuilder.Entity<BazarCost>().Property(p => p.Amount).HasColumnType("decimal(18,2)");

            // Unique Email
            modelBuilder.Entity<User>()
                .HasIndex(u => u.Email)
                .IsUnique();
        }

        public override Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
        {
            var messId = _tenantService.GetMessId();

            if (messId.HasValue)
            {
                foreach (var entry in ChangeTracker.Entries())
                {
                    if (entry.State == EntityState.Added)
                    {
                        var messIdProp = entry.Entity.GetType().GetProperty("MessId");
                        if (messIdProp != null)
                        {
                            messIdProp.SetValue(entry.Entity, messId.Value);
                        }
                    }
                }
            }

            return base.SaveChangesAsync(cancellationToken);
        }
    }
}
