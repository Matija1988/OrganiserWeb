using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using PO.Data;
using PO.Models;
using PO.Extensions;
using Microsoft.EntityFrameworkCore;

namespace PO.Controllers
{

    /// <summary>
    /// Namijenjeno za CRUD operacije nad entitetom members u bazi
    /// Ment for CRUD operations over entity members in DB
    /// </summary>
    [ApiController]
    [Route("api/v1/[controller]")]
    public class MemberController : ControllerBase
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

        public MemberController(POContext context)
        {
            _context = context;
        }
        /// <summary>
        /// Dohvaca sve members (clanove) iz baze
        /// Fetches all members from DB
        /// </summary>
        /// <param name="member"></param>
        /// <returns></returns>
        /// <response> code="200">Sve ok, ako nema podataka content-lenght:0</response>
        /// <response> code="400">Zahtjev nije valjan</response>
        /// <response> code="503">Baza na koju se spajam nije dostupna</response>


        [HttpGet]
        public IActionResult Get()
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                var memberDB = _context.members.ToList();

                if (memberDB == null || memberDB.Count == 0)
                {
                    return new EmptyResult();
                }

                return new JsonResult(memberDB.MapMemberReadList());
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status503ServiceUnavailable, ex.Message);
            }

        }

        /// <summary>
        /// Dodaje novog clana u bazu
        /// Adds new member into DB
        /// </summary>
        /// <param name="id"></param>
        /// <param name="member"></param>
        /// <returns></returns>
        /// <response> code="200">Sve ok, ako nema podataka content-lenght:0</response>
        /// <response> code="400">Zahtjev nije valjan</response>
        /// <response> code="503">Baza na koju se spajam nije dostupna</response>

        /// <summary>
        /// Dohvaca clana sa odgovarajucom vrijednosti ID
        /// Fetches member with correspoding ID from the DB
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
                var m = _context.members.Find(id);
                if (m == null)
                {
                    return new EmptyResult();
                }
                return new JsonResult(m.MapMemberInsertUpdateToDTO());
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status503ServiceUnavailable,
                    ex.Message);
            }

        }

        [HttpPost]

        public IActionResult Post(MemberDTOInsertUpdate memberDTO)
        {

            if (!ModelState.IsValid || memberDTO == null) { return BadRequest(); }

            try
            {
                var member = memberDTO.MapSmjerInsertUpdateFromDTO(new Member());
                _context.members.Add(member);
                _context.SaveChanges();
                return StatusCode(StatusCodes.Status200OK, member.MapMemberReadToDTO());
            }
           
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status503ServiceUnavailable, ex.Message);

            }

        }

        /// <summary>
        /// Mijenja postojeceg clana u bazi
        /// Updates existing member from DB
        /// </summary>
        /// <param name="id"></param>
        /// <param name="member"></param>
        /// <returns></returns>
        /// <response> code="200">Sve ok, ako nema podataka content-lenght:0</response>
        /// <response> code="400">Zahtjev nije valjan</response>
        /// <response> code="503">Baza na koju se spajam nije dostupna</response>

         
          


        [HttpPut]
        [Route("{id:int}")]

        public IActionResult Put(int id, MemberDTOInsertUpdate member)
        {
            if (id == 0 || !ModelState.IsValid || member == null)
            {
                return BadRequest();
            }

            try
            {
            
                var memberFromDB = _context.members.Find(id);
 
                
                if (memberFromDB == null) { return StatusCode(StatusCodes.Status204NoContent, id); }
                
                var entity = member.MapSmjerInsertUpdateFromDTO(memberFromDB);

                _context.members.Update(memberFromDB);
                _context.SaveChanges();

                return StatusCode(StatusCodes.Status200OK, memberFromDB.MapMemberInsertUpdateToDTO());

            } catch (Exception ex) {

                return StatusCode(StatusCodes.Status503ServiceUnavailable, ex.Message);
            }
        }

        /// <summary>
        /// Brise clana iz baze
        /// Deletes existing member from DB
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
                var memberFromDB = _context.members.Find(id);


                if (memberFromDB == null) { return StatusCode(StatusCodes.Status204NoContent, id); }

                _context.members.Remove(memberFromDB);
                _context.SaveChanges();

                return new JsonResult(new { message = "Deleted" }); 

            } 
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status503ServiceUnavailable, ex.Message);
            }
              
        
        }

        //[HttpGet]
        //[Route("Activities/{memberID:int}")]

        //public IActionResult MembersActivityConnector(int memberID)
        //{
        //    if (!ModelState.IsValid || memberID <= 0) { return BadRequest(); }

        //    try
        //    {
        //        var a = _context.members.Include(i => i.ActivitiesToMembers).FirstOrDefault(x => x.ID == memberID);

        //        if (a == null)
        //        {
        //            return new EmptyResult();
        //        }

        //        return new JsonResult(a.ActivitiesToMembers!.Map)
        //    }

        //}

    }
}
