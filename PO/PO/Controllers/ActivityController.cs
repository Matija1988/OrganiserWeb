using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.ModelBinding;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using PO.Data;
using PO.Extensions;
using PO.Mappers;
using PO.Models;

namespace PO.Controllers


/// <summary>
/// Namijenjeno za CRUD operacije nad entitetom activities u bazi
/// Ment for CRUD operations over entity activities in DB
/// </summary>
{
    [ApiController]
    [Route("api/v1/[controller]")]
    public class ActivityController : ControllerBase
    {

        /// <summary>
        /// Kontekst za rad s bazom koji ce biti postavljen pomocu ubrizgavanja ovisnosti
        /// Context for DB 
        /// </summary>

        private readonly POContext _context;


        /// <summary>
        /// Konstruktor klase koja prima PO kontekst pomocu ubrizgavanja ovisnosti
        /// Constructor that recieves PO context from dependency injection
        /// </summary>
        /// <param name="context"></param>

        public ActivityController(POContext context)
        {
            _context = context;

        }

        /// <summary>
        /// Dohvaca sve aktivnosti iz baze
        /// Fetches all activities from DB
        /// </summary>
        /// <returns></returns>
        /// <response> code="200">Sve ok, ako nema podataka content-lenght:0</response>
        /// <response> code="400">Zahtjev nije valjan</response>
        /// <response> code="503">Baza na koju se spajam nije dostupna</response>


        [HttpGet]
        public IActionResult Get()
        {
            if (!ModelState.IsValid) { return BadRequest(ModelState); }

            try
            {
                var ActivityFromDB = _context.activities.Include(a => a.ProjectID)
                    .Include(a => a.Members).ToList();



                if (ActivityFromDB == null || ActivityFromDB.Count == 0)
                {
                    return new EmptyResult();
                }
                return new JsonResult(ActivityFromDB.MapActivityReadList());

            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status503ServiceUnavailable, ex.Message);
            }

        }

        /// <summary>
        /// Dohvaca aktivnost sa odgovarajucom vrijednosti ID
        /// Fetches activity with correspoding ID from the DB
        /// </summary>
        /// <returns></returns>
        /// <response> code="200">Sve ok, ako nema podataka content-lenght:0</response>
        /// <response> code="400">Zahtjev nije valjan</response>
        /// <response> code="503">Baza na koju se spajam nije dostupna</response>

        [HttpGet]
        [Route("{id:int}")]

        public IActionResult Get(int id)
        {
            if (!ModelState.IsValid) { return BadRequest(ModelState); }

            try
            {
                var p = _context.activities.Include(a => a.ProjectID).Include(a => a.Members)
                    .FirstOrDefault(x => x.ID == id);

                if (p == null)
                {
                    return new EmptyResult();
                }
                return new JsonResult(p.MapActivityInsertUpdateDTO());
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status503ServiceUnavailable,
                    ex.Message);
            }

        }

        /// <summary>
        /// Dodaje novu aktivnost u bazu
        /// Adds a new activity into DB
        /// </summary>
        /// <param name="activity"></param>
        /// <returns></returns>
        /// <response> code="200">Sve ok, ako nema podataka content-lenght:0</response>
        /// <response> code="400">Zahtjev nije valjan</response>
        /// <response> code="503">Baza na koju se spajam nije dostupna</response>


        [HttpPost]

        public IActionResult Post(ActivityDTOInsertUpdate dto)
        {
            if (!ModelState.IsValid || dto == null) { return BadRequest(); }

            var project = _context.Projects.Find(dto.project);

            if (project == null)
            {
                return BadRequest();
            }

            var entity = dto.MapActivityInsertUpdateFromDTO(new Activity());

            entity.ProjectID = project;

            try
            {
                _context.activities.Add(entity);
                _context.SaveChanges();
                return StatusCode(StatusCodes.Status200OK, entity.MapReadActivityToDTO());

            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status503ServiceUnavailable, ex.Message);
            }

        }

        /// <summary>
        /// Mijenja postojecu aktivnost
        /// Changes existing activity
        /// </summary>
        /// <param name="id"></param>
        /// <param name="activity"></param>
        /// <returns></returns>

        [HttpPut]
        [Route("{id:int}")]

        public IActionResult Put(int id, ActivityDTOInsertUpdate dto)
        {
            if (id <= 0 || !ModelState.IsValid || dto == null)
            {
                return BadRequest();
            }

            try
            {
                var entity = _context.activities.Include(i => i.ProjectID).Include(i => i.Members)
                    .FirstOrDefault(x => x.ID == id);

                if (entity == null) { return StatusCode(StatusCodes.Status204NoContent, id); }

                var project = _context.Projects.Find(dto.project); 

                if(project == null) { return BadRequest(); }

                entity = dto.MapActivityInsertUpdateFromDTO(entity);

                entity.ProjectID = project;

                _context.activities.Update(entity);
                _context.SaveChanges();

                return StatusCode(StatusCodes.Status200OK, entity.MapReadActivityToDTO());
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status503ServiceUnavailable, ex);
            }

        }

        /// <summary>
        /// Brise postojecu aktivnost
        /// Deletes existing activity
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
                var activityFromDB = _context.activities.Find(id);

                if (activityFromDB == null) { return StatusCode(StatusCodes.Status204NoContent, id); }

                _context.activities.Remove(activityFromDB);
                _context.SaveChanges();

                return new JsonResult(new {message = "Deleted"});

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

        [HttpGet]
        [Route("Members/{activityID:int}")]

        public IActionResult GetActivityMember(int activityID)
        {
            if (!ModelState.IsValid || activityID <= 0)
            {
                return BadRequest();
            }

            try
            {
                var entity = _context.activities.Include(i => i.Members).FirstOrDefault(x => x.ID == activityID);

                if(entity == null)
                {
                    return new EmptyResult();
                }
                return new JsonResult(entity.Members!.MapMemberReadList());
            }
            catch (Exception e)
            {
                return StatusCode(StatusCodes.Status503ServiceUnavailable, e.Message);
            }

        }

        [HttpGet]
        [Route("Projects/{projectID:int}")]

        public IActionResult ConnectActivitiesAndProjects(int projectID)
        {
            if (!ModelState.IsValid || projectID <= 0)
            {
                return BadRequest();
            }

            try
            {
                var entity = _context.activities.Include(i => i.ProjectID).FirstOrDefault(x => x.ProjectID.ID == projectID);

                //var entity = _context.activities;



                var projectActivities = _context.activities.Select(i => i.ProjectID.ID == projectID).ToList();

                var mapper = ActivityMapper.InitInsertUpdateToDTO();



                if (entity == null)
                {
                    return new EmptyResult();
                }
                return new JsonResult(projectActivities);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status503ServiceUnavailable, ex.Message);
            }


        }

    }
}
