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
        [HttpDelete]
        [Route("{id:int}/Killswitchproject/{projectName}")]
        public IActionResult KillSwitchProject(int id, string projectName)
        {

            var entity = _context.Projects.Find(id);

            if (entity == null)
            {
                return StatusCode(StatusCodes.Status404NotFound);
            }

            var entityList = _context.activities.Include(p => p.Project)
                .Where(p => p.Project.ProjectName == projectName).ToList();
            var proofList = _context.ProofOfDeliveries.Include(pod => pod.Activity).ToList();
            var members = _context.members.Include(m => m.IActivities);

            if (!ModelState.IsValid) { return BadRequest(ModelState); }

            try
            {

                if(entity == null)
                {
                    return StatusCode(StatusCodes.Status403Forbidden, "WRONG INPUT!");
                } 

                else
                {
                    foreach (Activity activity in entityList)
                    {
                        activity.Members = null;
                        foreach (Member member in members)
                        {
                            member.IActivities.Remove(activity);
                        }

                        foreach (ProofOfDelivery pod in proofList)
                        {
                            if(pod.Activity.ID == activity.ID) { 
                            pod.Member = null;
                            _context.Remove(pod);
                            _context.SaveChanges();
                            }
                        }
                        _context.Remove(activity);
                        _context.SaveChanges();

                    }

                    _context.Remove(entity);
                    _context.SaveChanges();
                    return Ok("The project has been removed");
                }
            }
            catch (Exception ex)
            {
                throw new Exception(ex.InnerException.Message);
            }

        }

        protected override void ControlDelete(Project entity)
        {
            var entityList = _context.activities.Include(x => x.Project)
                .Where(x => x.Project.ID == entity.ID).ToList();

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
