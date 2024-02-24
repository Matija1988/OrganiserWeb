using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using PO.Data;
using PO.Models;

namespace PO.Controllers
{


    /// <summary>
    /// Namijenjeno za CRUD operacije nad entitetom projects u bazi
    /// Ment for CRUD operations over entity projects in DB
    /// </summary>

    [ApiController]
    [Route("api/v1/[controller]")]
    public class ProjectController : ControllerBase
    {
        /// <summary>
        /// Kontekst za rad s bazom koji ce biti postavljen pomocu ubrizgavanja ovisnosti
        /// Context for DB 
        /// </summary>

        private readonly POContext _context;

        /// <summary>
        /// Konstruktor klase koja prima PO kontekst pomocu ubrizgavanja ovisnosti
        /// Constructor that receives PO context from dependency injection
        /// </summary>
        /// <param name="context"></param>

        public ProjectController(POContext context)
        {
            _context = context;

        }

        /// <summary>
        /// Dohvaca sve projekte iz baze / fetches all projects from DB
        /// </summary>
        /// <returns></returns>
        /// <remarks>
        /// Primjer upita / querry example
        /// 
        ///  GET api/v1/Projects
        /// </remarks>>
        /// <returns>Projects u bazi / Projects from DB</returns>>
        /// <response> code="200">Sve ok, ako nema podataka content-length:0</response>
        /// <response> code="400">Zahtjev nije valjan</response>
        /// <respones> code="503">Baza na koju se spajam nije dostupna</respones>>

        [HttpGet]
        public IActionResult Get()
        {
            // kontrola ako model nije valjan

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);

            }
            try
            {
                var projectsDB = _context.projects.ToList();

                if (projectsDB == null || projectsDB.Count == 0)
                {
                    return new EmptyResult();
                }

                return new JsonResult(projectsDB);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status503ServiceUnavailable, ex.Message);


            }

        }

        /// <summary>
        /// Dodaje novi projekt u bazu
        /// Adds new project into DB
        /// </summary>
        /// <param name="project"></param>
        /// <returns></returns>
        /// <respons> code="200">Sve ok, ako nema podataka content-length:0</respons>>
        /// <response> code="400">Zahtjev nije valjan</response>
        /// <respones> code="503">Baza na koju se spajam nije dostupna</respones>>


        [HttpPost]

        public IActionResult Post(Project project)
        {
            if (!ModelState.IsValid || project == null) { return BadRequest(); }

            try
            {
                _context.projects.Add(project);
                _context.SaveChanges();
                return StatusCode(StatusCodes.Status200OK, project);

            }
            catch (SqlException ex)
            {

                return StatusCode(StatusCodes.Status503ServiceUnavailable, ex.InnerException.Message);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status503ServiceUnavailable, ex.Message);

            } 

        }

        /// <summary>
        /// Mijenja postojeci projekt u bazi
        /// Updates existing project in DB
        /// </summary>
        /// <param name="id"></param>
        /// <param name="project"></param>
        /// <returns></returns>
        /// <response> code="200">Sve ok, ako nema podataka content-lenght:0</response>
        /// <response> code="400">Zahtjev nije valjan</response>
        /// <response> code="503">Baza na koju se spajam nije dostupna</response>


        [HttpPut]
        [Route("{id:int}")]

        public IActionResult Put(int id, Project project)
        {
            if (id <= 0 || !ModelState.IsValid || project == null)
            {
                return BadRequest();
            }

            try
            {

                var projectFromDB = _context.projects.Find(id);

                if (projectFromDB == null) { return StatusCode(StatusCodes.Status204NoContent, id); }

                projectFromDB.UniqueID = project.UniqueID;
                projectFromDB.ProjectName = project.ProjectName;
                projectFromDB.DateStart = project.DateStart;
                projectFromDB.DateEnd = project.DateEnd;
                projectFromDB.IsFinished = project.IsFinished;

                _context.projects.Update(projectFromDB);
                _context.SaveChanges();

                return StatusCode(StatusCodes.Status200OK, projectFromDB);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status503ServiceUnavailable, ex.Message);

            }


        }

        /// <summary>
        /// Brise postojeci projekt iz base
        /// Deletes existing project from DB
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        /// <response> code="200">Sve ok, ako nema podataka content-lenght:0</response>
        /// <response> code="400">Zahtjev nije valjan</response>
        /// <response> code="503">Baza na koju se spajam nije dostupna</response>


        [HttpDelete]
        [Route("{id:int}")]
        [Produces("application/json")]

        public IActionResult Delete(int id)
        {

            if (!ModelState.IsValid || id <= 0) { return BadRequest(); }

            try
            {
                var projectFromDB = _context.projects.Find(id);

                if (projectFromDB == null) { return StatusCode(StatusCodes.Status204NoContent, id); }

                _context.projects.Remove(projectFromDB);
                _context.SaveChanges();

                return new JsonResult("{\"Message\":\"Deleted\"}");
            }
            catch (SqlException ex)
            {
                return StatusCode(StatusCodes.Status503ServiceUnavailable, ex.ErrorCode);
            }

            catch (Exception ex) 
            {
                return StatusCode(StatusCodes.Status503ServiceUnavailable, ex.Message);
             
            }


        }


    }
}
