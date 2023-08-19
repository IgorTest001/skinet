using API.Errors;
using Core.Interfaces;
using Infrastructure.Data;
using Microsoft.AspNetCore.Mvc;

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

            services.AddScoped<IProductRepository, ProductRepository>();
            services.AddScoped(typeof(IGenericRepository<>), typeof(GenericRepository<>));
            
            return services;
        }
    }
}