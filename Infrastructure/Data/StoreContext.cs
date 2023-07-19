using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Core.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;

namespace Infrastructure.Data
{
    public class StoreContext : DbContext
    {
        public StoreContext(DbContextOptions<StoreContext> options) : base(options)
        {
        }

        public DbSet<Product> Products { get; set; }
    }

    // public class StoreContextFactory : IDesignTimeDbContextFactory<StoreContext>
    // {
    //     public StoreContext CreateDbContext(string[] args)
    //     {
    //         var optionsBuilder = new DbContextOptionsBuilder<StoreContext>();
    //         optionsBuilder.UseSqlite("Data Source=skinet.db");

    //         return new StoreContext(optionsBuilder.Options);
    //     }
    // }
}