using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Query.SqlExpressions;
using PO.Data;
using PO.Extensions;
using PO.Models;
using System.Text;
using System.Xml;

namespace PO.Controllers
{


    /// <summary>
    /// Namijenjeno za CRUD operacije nad entitetom projects u bazi
    /// Ment for CRUD operations over entity projects in DB
    /// </summary>

    [ApiController]
    [Route("api/v1/[controller]")]
    public class ProjectController : POController<Project, ProjectDTORead, ProjectDTOInsertUpdate>
    {
        /// <summary>
        /// Kontekst za rad s bazom koji ce biti postavljen pomocu ubrizgavanja ovisnosti
        /// Context for DB 
        /// </summary>
        public ProjectController(POContext context) : base (context)
        {
            DbSet = _context.Projects;

        }

        protected override void ControlDelete(Project entity)
        {
            var entityList = _context.activities.Include(x => x.AssociatedProject)
                .Where(x => x.AssociatedProject.ID == entity.ID).ToList();

            if(entityList.Count != null && entityList.Count() > 0) 
            { 
            StringBuilder sb = new StringBuilder();
                sb.Append("Project cannot be deleted as it is connected to activities: ");
                foreach (var activity in entityList)
                {
                    sb.Append(activity.ActivityName).Append(",");
                }

                throw new Exception(sb.ToString().Substring(0, sb.ToString().Length - 2));
            }

            
        }
    }
}
