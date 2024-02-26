using Microsoft.EntityFrameworkCore;
using PO.Data;
using System.Reflection;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddDbContext<POContext>(po => 
po.UseSqlServer(builder.Configuration.GetConnectionString(name: "POContext")));


var app = builder.Build();

// Configure the HTTP request pipeline.

    app.UseSwagger();
app.UseSwaggerUI(opcije =>
{
    opcije.ConfigObject.
    AdditionalItems.Add("requestSnippetsEnabled", true);
});


app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.UseDefaultFiles();

app.UseDeveloperExceptionPage();
app.MapFallbackToFile("index.html");



app.Run();
