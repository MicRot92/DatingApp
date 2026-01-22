using System.Text;
using API.Middleware;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
builder.Services.AddDbContext<API.Data.AppDbContext>(options =>
{
    options.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection"));
});

builder.Services.AddCors();
builder.Services.AddScoped<API.Interfaces.ITokenService, API.Services.TokenService>();
builder.Services.AddScoped<API.Interfaces.IMemberRepository, API.Data.MemberRepository>();

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        var tokenKey = builder.Configuration["TokenKey"] ?? throw new Exception("TokenKey is not configured");
        if (tokenKey.Length < 64)
        {
            throw new Exception("TokenKey must be at least 64 characters long");
        }

        options.TokenValidationParameters = new Microsoft.IdentityModel.Tokens.TokenValidationParameters
        {
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(tokenKey)),
            ValidateIssuer = false,
            ValidateAudience = false
        };
    });

var app = builder.Build();


app.UseMiddleware<ExceptionMiddleware>();
// Configure the HTTP request pipeline.
app.UseCors(policy =>
    policy.AllowAnyOrigin()
          .AllowAnyMethod()
          .AllowAnyHeader().WithOrigins("http://localhost:4200", "https://localhost:4200"));
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

using var scope = app.Services.CreateScope();
var services = scope.ServiceProvider;
try
{
    var context = services.GetRequiredService<API.Data.AppDbContext>();
    await context.Database.MigrateAsync();
    await API.Data.Seed.SeedUsers(context);
}
catch (Exception ex)
{
    var logger = services.GetRequiredService<ILogger<Program>>();
    logger.LogError(ex, "An error occurred during migration");
}

app.Run();
