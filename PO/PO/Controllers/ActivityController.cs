using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.ModelBinding;
using Microsoft.Data.SqlClient;
using PO.Data;
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
                var ActivityFromDB = _context.activities.ToList();

                if (ActivityFromDB == null || ActivityFromDB.Count == 0)
                {
                    return new EmptyResult();
                }
                return new JsonResult(ActivityFromDB);

            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status503ServiceUnavailable, ex.Message);
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

        public IActionResult Post(Activity activity)
        {
            if (!ModelState.IsValid || activity == null) { return BadRequest(); }

            try
            {
                _context.activities.Add(activity);
                _context.SaveChanges();
                return StatusCode(StatusCodes.Status200OK, activity);

            }
            catch (SqlException ex)
            {
                return StatusCode(StatusCodes.Status503ServiceUnavailable, ex.Message);
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

        public IActionResult Put(int id, Activity activity)
        {
            if (id <= 0 || !ModelState.IsValid || activity == null)
            {
                return BadRequest();
            }

            try
            {
                var activityFromDB = _context.activities.Find(id);

                if (activityFromDB == null) { return StatusCode(StatusCodes.Status204NoContent, id); }

                activityFromDB.activityName = activity.activityName;
                activityFromDB.Description = activity.Description;
                activityFromDB.DateStart = activity.DateStart;
                activityFromDB.DateFinish = activity.DateFinish;
                activityFromDB.IsFinished = activity.IsFinished;
                activityFromDB.DateAccepted = activity.DateAccepted;
                activityFromDB.ProjectID = activity.ProjectID;

                _context.activities.Update(activityFromDB);
                _context.SaveChanges();

                return StatusCode(StatusCodes.Status200OK, activityFromDB);
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

                return new JsonResult("{\"Messages\":\"Deleted\"}");

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
