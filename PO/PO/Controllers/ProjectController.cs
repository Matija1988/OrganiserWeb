using Azure;
using FluentEmail.Core;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Microsoft.CodeAnalysis.CSharp.Syntax;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Query.SqlExpressions;
using PO.Data;
using PO.Extensions;
using PO.Models;
using System.IO.Compression;
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
        [Route("Project/Killswitchproject/{projectID:int}/{projectName}"), Authorize(Roles ="TeamLeader")]
        public IActionResult KillSwitchProject(int projectID,string projectName)
        {
            
            var entity = _context.Projects.Where(p => p.ProjectName == projectName).FirstOrDefault();
            var entityWithID = _context.Projects.Find(projectID);

            if(entityWithID != entity) 
            {
                return StatusCode(StatusCodes.Status400BadRequest, "Project ID does not match project name");
            }

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

        public async Task<ActionResult> getProjectFiles(int id)
        {
            var project = _context.Projects.Find(id);

            if (project == null)
            {
                return StatusCode(StatusCodes.Status404NotFound);
            }

            var activities = _context.activities.Include(p => p.Project).Where(p => p.Project.ID == id).ToList();
            var proofs = _context.ProofOfDeliveries.Include(a=> a.Activity).ToList();

            try
            {
                var ds = Path.DirectorySeparatorChar;

                var projectFolder = Path.Combine(Directory.GetCurrentDirectory() + ds + project.ProjectName);


                foreach (Activity activity in activities)
                {

                    string activityFolder = Path.Combine(projectFolder + ds + activity.ActivityName);

                    if (!System.IO.Directory.Exists(activityFolder))
                    {
                        System.IO.Directory.CreateDirectory(activityFolder);

                    }


                    foreach (ProofOfDelivery pod in proofs)
                    {
                        if(activity.ID == pod.ID) { 

                            var filePath = Path.Combine(pod.Location);

                            if (pod.Location == null) return NotFound("Not found at location " + pod.Location);

                            var fileContent = System.IO.File.ReadAllBytes(filePath);

                            if (fileContent == null) return BadRequest("Not found");


                            File(fileContent, MediaTypeNames.Application.Octet,
                                   pod.DocumentName + System.IO.Path.GetExtension(pod.Location));
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

        [HttpGet]
        [Route("downloadAllProjectProofs/{projectID:int}")] 
        
        public  async Task<IActionResult> DownloadAllProjectFiles(int projectID)
        {
            var proofs = ProofList(projectID);

            if(proofs == null)
            {
                return StatusCode(StatusCodes.Status409Conflict, "There are no files in this project to download!");
            }

            var project = _context.Projects.Find(projectID);

            var zipName = project.ProjectName;

            using(MemoryStream ms = new MemoryStream())
            {
                using (var zip = new ZipArchive(ms, ZipArchiveMode.Create, true)) 
                {
                    proofs.ForEach(pod =>
                    {
                        if(pod.Location == null)
                        {
                            return;
                        }

                        string fullPath = pod.Location;

                        var fileContent = System.IO.File.ReadAllBytes(fullPath);

                        var entry = zip.CreateEntry(pod.DocumentName + System.IO.Path.GetExtension(pod.Location));

                        using (var fileStream = new MemoryStream(fileContent))

                        using (var entryStream = entry.Open())
                        {
                           fileStream.CopyTo(entryStream);
                        }
                      
                    });
                }

                return File(ms.ToArray(), "application/zip", zipName + ".zip");
            }

        }
        


        private List<ProofOfDelivery> ProofList(int projectID)
        {

            var proofs = _context.ProofOfDeliveries.Include(a => a.Activity)
                .Where(p => p.Activity.Project.ID == projectID).ToList();

            return proofs;

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
