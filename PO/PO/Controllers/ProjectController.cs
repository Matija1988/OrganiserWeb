using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Query.SqlExpressions;
using PO.Data;
using PO.Extensions;
using PO.Models;
using System.Net.Mime;
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
        public ProjectController(POContext context) : base(context)
        {
            DbSet = _context.Projects;

        }

        /// <summary>
        /// Metoda koja brise sve entitete povezane sa projektom osim clanova koje mice iz liste
        /// clanova u aktivnosti
        /// Deletes all entities connected to the project, except members they are only removed 
        /// from the member list in the activity
        /// </summary>
        /// <param name="projectName"></param>
        /// <returns></returns>
        /// <exception cref="Exception"></exception>
        [HttpDelete]
        [Route("Project/Killswitchproject/{projectName}")]
        public IActionResult KillSwitchProject(string projectName)
        {

            var entity = _context.Projects.Where(p => p.ProjectName == projectName).FirstOrDefault();

            if (entity == null)
            {
                return StatusCode(StatusCodes.Status404NotFound);
            }

            var entityList = _context.activities.Include(p => p.Project)
                .Where(p => p.Project.ProjectName == projectName).ToList();
            var proofList = _context.ProofOfDeliveries.Include(pod => pod.Activity).ToList();
            var members = _context.members.Include(m => m.IActivities);


            try
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
                        if (pod.Activity.ID == activity.ID)
                        {
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
            catch (Exception ex)
            {
                throw new Exception(ex.InnerException.Message);
            }

        }

        [HttpGet]
        [Route("getProjectFiles/{id:int}")]

        public IActionResult getProjectFiles(int id)
        {
            var project = _context.Projects.Find(id);

            if (project == null)
            {
                return StatusCode(StatusCodes.Status404NotFound);
            }

            var activities = _context.activities.Include(p => p.Project).Where(p => p.ID == id).ToList();
            var proofs = _context.ProofOfDeliveries.Include(a => a.Activity).ToList();

            try
            {
                var ds = Path.DirectorySeparatorChar;

                string projectFolder = Path.Combine(Directory.GetCurrentDirectory()
                    + ds + project.ProjectName);

                if (!System.IO.Directory.Exists(projectFolder))
                {
                    System.IO.Directory.CreateDirectory(projectFolder);

                
                }

                foreach (Activity activity in activities)
                {
                    if (activity.IsFinished == true)
                    {
                        string activityFolder = Path.Combine(Directory.GetCurrentDirectory()
                        + ds + project.ProjectName + ds + activity.ActivityName);

                        if (!System.IO.Directory.Exists(activityFolder))
                        {
                            System.IO.Directory.CreateDirectory(activityFolder);

                
                        }

                        foreach (ProofOfDelivery pod in proofs)
                        {
                            if (pod.Activity.ID == activity.ID && pod.Location != null && pod.Location.Length < 0)
                            {
                                var filePath = Path.Combine(activityFolder + ds);

                                var fileContent = System.IO.File.ReadAllBytes(filePath);

                                if (fileContent == null) return BadRequest("Not found");

                                return File(fileContent, MediaTypeNames.Application.Octet,
                                    pod.DocumentName + System.IO.Path.GetExtension(pod.Location));
                            }       
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                StringBuilder sb = new StringBuilder();
                sb.Append("The download was stopped: Possible issue in entity connections").Append(ex.Message);
                return BadRequest(sb);
            }


            return StatusCode(StatusCodes.Status200OK);

        }


        /// <summary>
        /// Brisanje entiteta projekt
        /// Delete project entity
        /// </summary>
        /// <param name="entity"></param>
        /// <exception cref="Exception"></exception>

        protected override void ControlDelete(Project entity)
        {
            var entityList = _context.activities.Include(x => x.Project)
                .Where(x => x.Project.ID == entity.ID).ToList();

            if (entityList.Count != null && entityList.Count() > 0)
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
