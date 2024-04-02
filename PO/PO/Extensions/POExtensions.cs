using Microsoft.CodeAnalysis.CSharp.Syntax;

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
            });
        }
    }
}

