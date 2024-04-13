using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using FluentEmail;

using PO.Data;
using PO.Extensions;
using System.Text;
using System.Reflection;
using Microsoft.OpenApi.Models;
using PO.Services;




var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();

// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddRazorPages().AddRazorRuntimeCompilation();
builder.Services.AddFluentEmail(builder.Configuration);
builder.Services.AddScoped<IEmailService, EmailService>();  


builder.Services.AddSwaggerGen( c=>
{
    c.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "jwtToken_Auth_API",
        Version = "v1",
    });
    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Name = "Authorization",
        Type = SecuritySchemeType.ApiKey,
        Scheme = "Bearer",
        BearerFormat = "JWT",
        In = ParameterLocation.Header,
        Description= "ENTER JWT Token with bearer token. Format like Bearer[space] token"
    });
    c.AddSecurityRequirement(new OpenApiSecurityRequirement{
        {
        new OpenApiSecurityScheme {
            Reference = new OpenApiReference
            {
                Type = ReferenceType.SecurityScheme,
                Id = "Bearer",

            }
        },
        new string[] {}
         }
    });
});
builder.Services.AddPOCORS();

builder.Services.AddDbContext<POContext>(po =>
po.UseSqlServer(builder.Configuration.GetConnectionString(name: "POContext")));

builder.Services.AddAuthentication(x =>
{
    x.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    x.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
    x.DefaultScheme = JwtBearerDefaults.AuthenticationScheme;
}).AddJwtBearer(x =>
{
    x.TokenValidationParameters = new TokenValidationParameters
    {
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes
        ("FaceInTheMirrorAllSkinAndBoneBloodshotEyesAnd a heart of stone")),
        ValidateIssuer = false,
        ValidateAudience = false,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = false,
    };
});

builder.Services.AddAuthorization();

var app = builder.Build();

// Configure the HTTP request pipeline.

app.UseSwagger();

app.UseSwaggerUI(opcije =>
{
    opcije.ConfigObject.
    AdditionalItems.Add("requestSnippetsEnabled", true);
});


app.UseHttpsRedirection();

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();
app.UseStaticFiles();

app.UseCors("CorsPolicy");

app.UseDefaultFiles();
app.UseDeveloperExceptionPage();
app.MapFallbackToFile("index.html");

app.Run();
