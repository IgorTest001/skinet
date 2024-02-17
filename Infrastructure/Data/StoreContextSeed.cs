using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Text.Json;
using System.Threading.Tasks;
using Core.Entities;
using Core.Entities.OrderAggregate;
using Microsoft.Extensions.Logging;

namespace Infrastructure.Data
{
    public class StoreContextSeed
    {
        public static async Task SeedAsync(StoreContext storeContext, ILogger logger)
        {
            var path = Path.GetDirectoryName(Assembly.GetExecutingAssembly().Location);
            try
            {
                if (!storeContext.Products.Any())
                {
                    var productsData = File.ReadAllText(@"..\Infrastructure\Data\SeedData\products.json");
                    var products = JsonSerializer.Deserialize<List<Product>>(productsData);
                    storeContext.Products.AddRange(products);//\Infrastructure\Data\SeedData\products.json
                }

                if (!storeContext.ProductBrands.Any())
                {
                    var productBrandsData = File.ReadAllText(@"..\Infrastructure\Data\SeedData\brands.json");
                    var productBrands = JsonSerializer.Deserialize<List<ProductBrand>>(productBrandsData);
                    storeContext.ProductBrands.AddRange(productBrands);
                }

                if (!storeContext.ProductTypes.Any())
                {
                    var productTypesData = File.ReadAllText(@"..\Infrastructure\Data\SeedData\types.json");
                    var productTypes = JsonSerializer.Deserialize<List<ProductType>>(productTypesData);
                    storeContext.ProductTypes.AddRange(productTypes);
                }

                if (!storeContext.DeliveryMethods.Any())
                {
                    var dmData = File.ReadAllText(@"..\Infrastructure\Data\SeedData\delivery.json");
                    var deliveryMethods = JsonSerializer.Deserialize<List<DeliveryMethod>>(dmData);
                    storeContext.DeliveryMethods.AddRange(deliveryMethods);//\Infrastructure\Data\SeedData\products.json
                }


                // if (storeContext.ChangeTracker.HasChanges()) 
                     await storeContext.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                logger.LogError(ex.Message);
            }
        }
    }
}