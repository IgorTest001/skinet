using API.Errors;
using API.Extenstions;
using API.Helpers;
using API.Middleware;
using Core.Interfaces;
using Infrastructure.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();

//var connection =  builder.Configuration.GetConnectionString("DefaultConnection");
//(x => x.UseSqlite("Data Source = skinet.db"));
builder.Services.AddDbContext<StoreContext>(x => x.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection")));
builder.Services.AddApplicationServices(builder.Configuration);
builder.Services.AddAutoMapper(typeof(MappingProfiles));

// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerDocumentation();
builder.Services.AddCors(options => 
                            options.AddPolicy("CorsPolicy", policy => 
                            {
                                policy.AllowAnyHeader().AllowAnyMethod().WithOrigins("https://localhost:4200");
                            }));

var app = builder.Build();

// Configure the HTTP request pipeline.

app.UseMiddleware<ExceptionMiddleware>();
app.UseSwaggerDocumentation();
app.UseCors("CorsPolicy");

app.UseStatusCodePagesWithReExecute("/errors/{0}");
app.UseHttpsRedirection();
app.UseRouting();
app.UseStaticFiles();
app.UseAuthorization();

app.MapControllers();

using var scope = app.Services.CreateScope();
var services = scope.ServiceProvider;
var storeContext = services.GetRequiredService<StoreContext>();
var logger = services.GetRequiredService<ILogger<Program>>();
try
{
    await storeContext.Database.MigrateAsync();
    await StoreContextSeed.SeedAsync(storeContext, logger);
}
catch(Exception ex)
{
    logger.LogError(ex, "An error occured during migration.");
}

app.Run();
