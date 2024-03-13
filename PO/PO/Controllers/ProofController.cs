using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PO.Data;
using PO.Extensions;
using PO.Models;

namespace PO.Controllers
{

    /// <summary>
    /// Namijenjeno za CRUD operacije nad entitetom proofOfDelivieries u bazi
    /// predstavljaju dokumente dokaznice o izvrsenim aktivnostima
    /// Ment for CRUD operations over entity proofOfDelivieries in DB
    /// represents documents that prove delivery of a service / product
    /// </summary>
    [ApiController]
    [Route("api/v1/[controller]")]
    public class ProofController : ControllerBase 
    {
        /// <summary>
        /// Kontekst za rad s bazom 
        /// Context for DB
        /// </summary>
        private readonly POContext _context;

        /// <summary>
        /// Konstruktor klase koja prima PO kontekst pomocu ubrizgavanja ovisnosti
        /// Constructor that receives PO context via dependency injection
        /// </summary>
        /// <param name="context"></param>

        public ProofController(POContext context)
        {
            _context = context;
        }

        /// <summary>
        /// Dohvaca sve dokaznice iz baze / fetches all proofs from DB
        /// </summary>
        /// <returns></returns>
        /// <response> code="200">Sve ok, ako nema podataka content-lenght:0</response>
        /// <response> code="400">Zahtjev nije valjan</response>
        /// <response> code="503">Baza na koju se spajam nije dostupna</response>

        [HttpGet]

        public IActionResult Get()
        {
            if(!ModelState.IsValid) { return BadRequest(ModelState); }

            try
            {
                var proofOfDeliveryFromDB = _context.ProofOfDeliveries.Include(i => i.ActivityID)
                    .Include(i => i.MemberID).ToList();

                if(proofOfDeliveryFromDB == null || proofOfDeliveryFromDB.Count == 0)
                {
                    return new EmptyResult();
                }
                return new JsonResult(proofOfDeliveryFromDB.MapProofReadList());
            } 
            catch (Exception ex) 
            { 
            return StatusCode(StatusCodes.Status503ServiceUnavailable, ex.Message);
            }

        }

        /// <summary>
        /// Dohvaca dokaznicu sa odgovarajucom vrijednosti ID
        /// Fetches proof of delivery with correspoding ID from the DB
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
                var pod = _context.ProofOfDeliveries.Include(i => i.ActivityID)
                    .Include (i => i.MemberID).FirstOrDefault(x=> x.ID == id);

                if (pod == null)
                {
                    return new EmptyResult();
                }
                return new JsonResult(pod.MapProofInsertUpdateToDTO());
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status503ServiceUnavailable,
                    ex.Message);
            }

        }

        /// <summary>
        /// Dodaje novu dokaznicu u bazu
        /// Adds new proof into DB
        /// </summary>
        /// <param name="proofOfDelivery"></param>
        /// <returns></returns>
        /// <response> code="200">Sve ok, ako nema podataka content-lenght:0</response>
        /// <response> code="400">Zahtjev nije valjan</response>
        /// <response> code="503">Baza na koju se spajam nije dostupna</response>


        [HttpPost]

        public IActionResult Post(ProofDTOInsertUpdate dto) 
        { 
        
            if(!ModelState.IsValid || dto == null) { return BadRequest(); }

            var member = _context.members.Find(dto.member);

            if (member == null)
            {
                return BadRequest();
            }

            var activity = _context.activities.Find(dto.activity);

            if(activity == null)
            {
                return BadRequest();
            }

            var entity = dto.MapProofInsertUpdateFromDTO(new ProofOfDelivery());

            entity.MemberID = member;
            entity.ActivityID = activity;

            try
            {
                _context.ProofOfDeliveries.Add(entity);
                _context.SaveChanges();

                return StatusCode(StatusCodes.Status200OK, entity.MapProofReadToDTO());
            }
            
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status503ServiceUnavailable, ex.Message);
            }
               
        }

        /// <summary>
        /// Izmjeni vec postojecu dokaznicu
        /// Update existing proof
        /// </summary>
        /// <param name="id"></param>
        /// <param name="proofOfDelivery"></param>
        /// <returns></returns>
        /// <response> code="200">Sve ok, ako nema podataka content-lenght:0</response>
        /// <response> code="400">Zahtjev nije valjan</response>
        /// <response> code="503">Baza na koju se spajam nije dostupna</response>


        [HttpPut]
        [Route("{id:int}")]

        public IActionResult Put(int id, ProofDTOInsertUpdate dto)
        {
            if (id <= 0 || !ModelState.IsValid || dto == null)
            {
                return BadRequest();
            }

            try
            {
                var entity = _context.ProofOfDeliveries.Include(i => i.ActivityID)
                    .Include(i => i.MemberID).FirstOrDefault(x => x.ID == id);

                if(entity == null) { return StatusCode(StatusCodes.Status204NoContent, id); }

                var activity = _context.activities.Find(dto.activity);

                if(activity == null) { return BadRequest(); }

                var member = _context.members.Find(dto.member);

                if(member == null) { return BadRequest(); }

                entity = dto.MapProofInsertUpdateFromDTO(entity);

                entity.ActivityID = activity;
                entity.MemberID = member;
                            
                _context.ProofOfDeliveries.Update(entity);
                _context.SaveChanges();

                return StatusCode(StatusCodes.Status200OK, entity.MapProofReadToDTO());

            } catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status503ServiceUnavailable, ex.Message);
            }


        }

        /// <summary>
        /// Brise postojecu dokaznicu iz base
        /// Deletes existing proof from DB
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
                var proofOfDeliveryFromDB = _context.ProofOfDeliveries.Find(id);

                if(proofOfDeliveryFromDB == null) { return StatusCode(StatusCodes.Status204NoContent, id); }

                _context.ProofOfDeliveries.Remove(proofOfDeliveryFromDB);
                _context.SaveChanges();

                return new JsonResult(new { message = "Deleted"});
            }
             catch(Exception ex) 
            {
                return StatusCode(StatusCodes.Status503ServiceUnavailable, ex.Message);
            
            }

        }

        [HttpGet]
        [Route("Members/{idProof:int}")]

        public IActionResult GetMembers(int idProof)
        {
            if (!ModelState.IsValid || idProof <= 0)
            {
                return BadRequest();
            }

            try
            {
                var pod = _context.ProofOfDeliveries.Include(i => i.MemberID).FirstOrDefault(x => x.ID == idProof);
                if(pod == null) { return BadRequest(); }
                return new JsonResult(pod.MemberID!.MapMemberReadToDTO());
            } 
            catch(Exception ex)
            {
                return StatusCode(StatusCodes.Status503ServiceUnavailable, ex.Message);
            }




        }


    }

}
