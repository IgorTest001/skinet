using API.Errors;
using Core.Interfaces;
using Infrastructure;
using Infrastructure.Data;
using Infrastructure.Services;
using Microsoft.AspNetCore.Mvc;
using StackExchange.Redis;

namespace API.Extenstions
{
    public static class ApplicationExtensions
    {
        public static IServiceCollection AddApplicationServices(this IServiceCollection services, IConfiguration config)
        {

            services.Configure<ApiBehaviorOptions>(options => 
            {
                options.InvalidModelStateResponseFactory = 
                    actionContext =>
                    {
                        var errors = actionContext.ModelState
                                                .Where(error => error.Value.Errors.Count > 0)
                                                .SelectMany(x => x.Value.Errors)
                                                .Select(x => x.ErrorMessage).ToArray();

                        var errorResponse = new ApiValidationErrorResponse
                        {
                            Errors = errors
                        };
                        
                        return new BadRequestObjectResult(errorResponse);
                    };   
            });

            services.AddSingleton<IConnectionMultiplexer>(c => 
            {
                var options = ConfigurationOptions.Parse(config.GetConnectionString("Redis"));
                return ConnectionMultiplexer.Connect(options);
            });

            services.AddScoped<ITokenService, TokenService>();
            services.AddScoped<IOrderService, OrderService>();
            services.AddScoped<IUnitOfWork, UnitOfWork>();
            services.AddScoped<IProductRepository, ProductRepository>();
            services.AddScoped(typeof(IGenericRepository<>), typeof(GenericRepository<>));
            services.AddScoped<IBasketRepository, BasketRepository>();
            
            return services;
        }
    }
}