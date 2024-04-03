﻿
using System.Reflection;



namespace PO.Extensions
{
    public static class POExtensions
    {
        public static void AddPOSwaggerGen(this IServiceCollection Services)
        {
            Services.AddSwaggerGen(sgo =>
            {
                var o = new Microsoft.OpenApi.Models.OpenApiInfo()
                {
                    Title = "Project organiser",
                    Version = "v1",
                    Contact = new Microsoft.OpenApi.Models.OpenApiContact()
                    {
                        Email = "matijapavkovic74@gmail.com",
                        Name = "Matija Pavkovic"
                    },
                    Description = "This is documentation for Project organiser API",
                    License = new Microsoft.OpenApi.Models.OpenApiLicense()
                    {
                        Name = "Education lisence"
                    }
                };
                sgo.SwaggerDoc("v1", o);

                var xmlFile = $"{Assembly.GetExecutingAssembly().GetName().Name}.xml";
                var xmlPath = Path.Combine(AppContext.BaseDirectory, xmlFile);
                sgo.IncludeXmlComments(xmlPath, includeControllerXmlComments: true);
            });

        }

        public static void AddPOCORS(this IServiceCollection Services)
        {
            Services.AddCors(options =>
            {
                options.AddPolicy("CorsPolicy",
                    builder =>
                    builder.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader());
            });
        }
    }
}
