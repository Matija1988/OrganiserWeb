using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Query.SqlExpressions;
using PO.Data;
using PO.Extensions;
using PO.Models;
using System.Xml;

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
                var projectsDB = _context.Projects.ToList();

                if (projectsDB == null || projectsDB.Count == 0)
                {
                    return new EmptyResult();
                }

                return new JsonResult(projectsDB.MapProjectReadList());
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status503ServiceUnavailable, ex.Message);


            }

        }

        /// <summary>
        /// Dohvaca projekt sa odgovarajucom vrijednosti ID
        /// Fetches project with correspoding ID from the DB
        /// </summary>
        /// <returns></returns>
        /// <response> code="200">Sve ok, ako nema podataka content-lenght:0</response>
        /// <response> code="400">Zahtjev nije valjan</response>
        /// <response> code="503">Baza na koju se spajam nije dostupna</response>

        [HttpGet]
        [Route("{id:int}")]

        public IActionResult Get(int id)
        {
            if (!ModelState.IsValid || id <= 0) { return BadRequest(ModelState); }

            try
            {
                var pro = _context.Projects.Find(id);
                if (pro == null)
                {
                    return new EmptyResult();
                }
                return new JsonResult(pro.MapProjectReadToDTO());
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status503ServiceUnavailable,
                    ex.Message);
            }

        }

        /// <summary>
        /// Dodaje novi projekt u bazu
        /// Adds new project into DB
        /// </summary>
        /// <param name="projectDTO"></param>
        /// <returns></returns>
        /// <respons> code="200">Sve ok, ako nema podataka content-length:0</respons>>
        /// <response> code="400">Zahtjev nije valjan</response>
        /// <respones> code="503">Baza na koju se spajam nije dostupna</respones>>


        [HttpPost]

        public IActionResult Post(ProjectDTOInsertUpdate projectDTO)
        {
            if (!ModelState.IsValid || projectDTO == null) { return BadRequest(); }

            try
            {

                var project = projectDTO.MapProjectInsertUpdateFromDTO(new Project());

                _context.Projects.Add(project);
                _context.SaveChanges();
                return StatusCode(StatusCodes.Status200OK, project.MapProjectReadToDTO());

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
        /// <param name="projectDTO"></param>
        /// <returns></returns>
        /// <response> code="200">Sve ok, ako nema podataka content-lenght:0</response>
        /// <response> code="400">Zahtjev nije valjan</response>
        /// <response> code="503">Baza na koju se spajam nije dostupna</response>


        [HttpPut]
        [Route("{id:int}")]

        public IActionResult Put(int id, ProjectDTOInsertUpdate projectDTO)
        {
            if (id <= 0 || !ModelState.IsValid || projectDTO == null)
            {
                return BadRequest();
            }

            try
            {

                var projectFromDB = _context.Projects.Find(id);

                if (projectFromDB == null) { return StatusCode(StatusCodes.Status204NoContent, id); }

                var project = projectDTO.MapProjectInsertUpdateFromDTO(projectFromDB);
                             

                _context.Projects.Update(projectFromDB);
                _context.SaveChanges();

                return StatusCode(StatusCodes.Status200OK, projectFromDB.MapProjectInsertUpdateToDTO());
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
                var projectFromDB = _context.Projects.Find(id);

                if (projectFromDB == null) { return StatusCode(StatusCodes.Status204NoContent, id); }

                _context.Projects.Remove(projectFromDB);
                _context.SaveChanges();

                return new JsonResult(new { message = "Deleted"}) ;
            }
            
            catch (Exception ex) 
            {
                return StatusCode(StatusCodes.Status503ServiceUnavailable, ex.Message);
             
            }


        }
        [HttpGet]
        [Route("/Projects/sort/{finished:bool}")]
        public IActionResult ShowProjectsByStatus(bool finished)
        {
            if (!ModelState.IsValid || finished == null) { return BadRequest(); }
            
            try { 
            var projects = _context.Projects.Where(i=> i.IsFinished == finished).ToList();

            if (projects == null)
            {
                return new EmptyResult();
            }

            return new JsonResult(projects.MapProjectReadList());
            } catch (Exception ex) 
            {
                return StatusCode(StatusCodes.Status503ServiceUnavailable, ex.Message);
            }
             
        }

        [HttpGet]
        [Route("/Projects/Search/{input}")]

        public IActionResult SearchProjectsByUniqueID(string input)
        {
            if (!ModelState.IsValid || input == null) { return BadRequest(); }

            try
            {
                var projects = _context.Projects.Where(i => i.UniqueID.Contains(input)).ToList();

                if(projects == null)
                {
                    return new EmptyResult();
                }

                return new JsonResult(projects.MapProjectReadList());
            } 
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status503ServiceUnavailable, ex.Message);
            }

        }

        [HttpGet]
        [Route("/Projects/SearchByName/{input}")]

        public IActionResult SearchProjectsByName(string input)
        {
            if (!ModelState.IsValid || input == null) { return BadRequest(); }

            try
            {
                var projects = _context.Projects.Where(i=> i.ProjectName.Contains(input)).ToList(); 

                if(projects == null)
                {
                    return new EmptyResult();
                }

                return new JsonResult(projects.MapProjectReadList());

            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status503ServiceUnavailable, ex.Message);
            }
        }


    }
}
