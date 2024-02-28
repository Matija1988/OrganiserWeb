using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using PO.Data;


var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();


builder.Services.AddDbContext<POContext>(po => 
po.UseSqlServer(builder.Configuration.GetConnectionString(name: "POContext")));

builder.Services.AddAuthorization();

builder.Services.AddIdentityApiEndpoints<IdentityUser>()
    .AddEntityFrameworkStores<POContext>();

var app = builder.Build();

// Configure the HTTP request pipeline.

    app.UseSwagger();
app.UseSwaggerUI(opcije =>
{
    opcije.ConfigObject.
    AdditionalItems.Add("requestSnippetsEnabled", true);
});

app.MapIdentityApi<IdentityUser>(); 

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();
app.UseStaticFiles();

app.UseDefaultFiles();

app.UseDeveloperExceptionPage();
app.MapFallbackToFile("index.html");



app.Run();
