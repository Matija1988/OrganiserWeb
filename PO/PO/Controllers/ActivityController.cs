using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage.Json;
using PO.Data;
using PO.Mappers;
using PO.Models;
using System.Text;

namespace PO.Controllers


/// <summary>
/// Namijenjeno za CRUD operacije nad entitetom activities u bazi
/// Ment for CRUD operations over entity activities in DB
/// </summary>
{
    [ApiController]
    [Route("api/v1/[controller]")]
    public class ActivityController : POController<Activity, ActivityDTORead, ActivityDTOInsertUpdate>
    {

        /// <summary>
        /// Konstruktor klase koja prima PO kontekst pomocu ubrizgavanja ovisnosti
        /// Constructor that recieves PO context from dependency injection
        /// </summary>
        /// <param name="context"></param>

        public ActivityController(POContext context) : base(context)
        {
            DbSet = _context.activities;
            _mapper = new ActivityMapper();
        }
 

        /// <summary>
        /// Dohvaca sve clanove koji rade na aktivnosti
        /// Lists all members assigned to a activity
        /// </summary>
        /// <param name="activityID"></param>
        /// <returns></returns>

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
                Mapping<Member, MemberDTORead, MemberDTOInsertUpdate> mapping 
                    = new Mapping<Member, MemberDTORead, MemberDTOInsertUpdate>(); 
                return new JsonResult(mapping.MapReadList(entity.Members));
            }
            catch (Exception e)
            {
                return StatusCode(StatusCodes.Status503ServiceUnavailable, e.Message);
            }

        }

        /// <summary>
        /// Dodaj aktivnost clanu
        /// Assign activity to member
        /// </summary>
        /// <param name="id"></param>
        /// <param name="memberID"></param>
        /// <returns></returns>

        [HttpPost]
        [Route("{id:int}/add/{memberID:int}")]

        public IActionResult AssignMemberToActivity(int id, int memberID)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest();
            }

            if (id <= 0 || memberID <= 0)
            {
                return BadRequest();
            }

            try
            {
                var memberToActivity = _context.activities.Include(i => i.Members).FirstOrDefault(i => i.ID == id);

                if (memberToActivity == null)
                {
                    return BadRequest();
                }

                var member = _context.members.Find(memberID);

                if (member == null) return BadRequest();

                memberToActivity.Members.Add(member);

                _context.activities.Update(memberToActivity);
                _context.SaveChanges();

                return Ok();

            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status503ServiceUnavailable, ex.Message);
            }

        }

        /// <summary>
        /// Makni clana iz aktivnosti
        /// Remove a member from activity
        /// </summary>
        /// <param name="id"></param>
        /// <param name="memberID"></param>
        /// <returns></returns>

        [HttpDelete]
        [Route("{id:int}/delete/{memberID:int}")]

        public IActionResult RemoveMemberFromActivity(int id, int memberID) 
        {
            if (!ModelState.IsValid) return BadRequest();

            if (id <= 0 || memberID <= 0) return BadRequest();

            try
            {
                var memberFromActivity = _context.activities.Include(i => i.Members)
                    .FirstOrDefault(i => i.ID == id);

                if (memberFromActivity == null) return BadRequest();

                var member = _context.members.Find(memberID);

                if (member == null) return BadRequest();

                memberFromActivity.Members.Remove(member);

                _context.activities.Update(memberFromActivity);
                _context.SaveChanges();
                return Ok();
            }
            catch (Exception ex) 
            {
                return StatusCode(StatusCodes.Status503ServiceUnavailable, ex.Message);
            }

        }



        /// <summary>
        /// Dohvaca sve aktivnosti jednog projekta
        /// Lists all activities of a project
        /// </summary>
        /// <param name="projectID"></param>
        /// <returns></returns>

        [HttpGet]
        [Route("listprojectactivities/{projectID:int}")]

        public IActionResult ConnectActivitiesAndProjects(int projectID)
        {
            if (!ModelState.IsValid || projectID <= 0)
            {
                return BadRequest();
            }

            try
            {
                var entity = _context.activities
                    .Include(i => i.Project)
                    .Where(i => i.Project.ID == projectID)
                    .OrderBy(i => i.ActivityName)
                    .ToList();


                if (entity == null)
                {
                    return new EmptyResult();
                }
                return new JsonResult(_mapper.MapReadList(entity));
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status503ServiceUnavailable, ex.Message);
            }


        }

        /// <summary>
        /// Pretrazuje aktivnosti usporedujuci input string
        /// Searches activities via input string
        /// </summary>
        /// <param name="input"></param>
        /// <returns></returns>

        [HttpGet]
        [Route("Activities/SearchByName/{input}")]
        public IActionResult SearchActivityByName(string input)
        {
            if (!ModelState.IsValid || input == null)
            {
                return BadRequest();
            }

            try
            {
                var activities = _context.activities.Include(i=> i.Project)
                    .Where(i => i.ActivityName
                    .Contains(input)).ToList();

                if(activities == null)
                {
                    return new EmptyResult();
                }

                return new JsonResult(_mapper.MapReadList(activities));

            } 
            catch (Exception ex) 
            {
                return StatusCode(StatusCodes.Status503ServiceUnavailable, ex.Message);
            
            }

        }

        /// <summary>
        /// Pretrazuje aktivnosti po statusu - True = zavrsen, False = u provedbi
        /// Searches activities by status - True = finished, False = ongoing
        /// </summary>
        /// <param name="finished"></param>
        /// <returns></returns>

        [HttpGet]
        [Route("Activities/SearchByStatus/{finished:bool}")]
        public IActionResult SearchByStatus(bool finished)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest();
            }

            try
            {
                var activities = _context.activities.Include(i=> i.Project)
                    .Where(i=> i.IsFinished == finished).ToList();  

                if(activities == null)
                {
                    return new EmptyResult();
                }

                return new JsonResult(_mapper.MapReadList(activities));
            } 
            catch (Exception ex) 
            {
                return StatusCode(StatusCodes.Status503ServiceUnavailable, ex.Message);
            }

        }

        [HttpGet]
        [Route("getPagination/{page}")]
        public IActionResult GetPagination(int page, string condition ="")
        {
            var byPage = 8;
            condition = condition.ToLower();

            try
            {
                var activities = _context.activities.Include(p => p.Project)
                    .Where(a => EF.Functions.Like(a.ActivityName.ToLower(), "%"+ condition +"%") 
                    || EF.Functions.Like(a.Project.ProjectName.ToLower(), "%" + condition+"%" ))
                    .Skip((byPage * page) - byPage)
                    .Take(byPage)
                    .OrderBy(a => a.ActivityName)
                    .ToList();

                return new JsonResult(_mapper.MapReadList(activities));
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }

        }



        [Authorize(Roles ="TeamLeader")]
        /// <summary>
        /// Premoscivanje i prilagodavanje delete metode
        /// Override and adaptation of delete method
        /// </summary>
        /// <param name="entity"></param>
        /// <exception cref="Exception"></exception>
        protected override void ControlDelete(Activity entity)
        {
            if(entity != null && entity.Members != null && entity.Members.Count() > 0)
            {
                StringBuilder sb = new StringBuilder();
                sb.Append("Activity cannot be deleted since it contains members: ");
                foreach(var e in entity.Members)
                {
                    sb.Append(e.FirstName).Append(" ").Append(e.LastName).Append(", ");
                }

                throw new Exception(sb.ToString().Substring(0, sb.ToString().Length - 2));

            }
        }

        /// <summary>
        /// Premoscivanje i prilagodavanje POST metode
        /// Override and adaptation of POST method
        /// </summary>
        /// <param name="entityDTO"></param>
        /// <returns></returns>
        /// <exception cref="Exception"></exception>
        protected override Activity CreateEntity(ActivityDTOInsertUpdate entityDTO)
        {

            var project = _context.Projects.Find(entityDTO.ProjectID)
                ?? throw new Exception("There is no project with " + entityDTO.ProjectID + " in database!");


            var entity = _mapper.MapInsertUpdatedFromDTO(entityDTO);

            entity.Members = new List<Member>();
            entity.Project = project;
    
            return entity;
            

        }

        /// <summary>
        /// Premoscivanje i prilagodavanje GET metode
        /// Override and adaptation of GET method
        /// </summary>
        /// <returns></returns>
        /// <exception cref="Exception"></exception>
        protected override List<ActivityDTORead> ReadAll()
        {
            var list = _context.activities
                .Include(a => a.Project)
                .ToList();

            if (list == null || list.Count == 0)
            {
                throw new Exception("No data in database!");
            }

            return _mapper.MapReadList(list);

        }
        /// <summary>
        /// 
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        /// <exception cref="Exception"></exception>
        protected override Activity FindEntity(int id)
        {
            return _context.activities.Include(i => i.Project)
                .FirstOrDefault(x => x.ID == id) ?? throw new Exception("No activity with id " + id + " in database!");
        }


        /// <summary>
        /// 
        /// </summary>
        /// <param name="entityDTO"></param>
        /// <param name="entityFromDB"></param>
        /// <returns></returns>
        /// <exception cref="Exception"></exception>
        protected override Activity UpdateEntity(ActivityDTOInsertUpdate entityDTO, Activity entityFromDB)
        {
            var projectFromDB = _context.Projects.Find(entityDTO.ProjectID) 
                ?? throw new Exception("No entitiy with id " + entityFromDB.Project.ID + " in database!");
            //entityFromDB = _mapper.MapInsertUpdatedFromDTO(entityDTO);

            

            entityFromDB.ActivityName = entityDTO.ActivityName; 
            entityFromDB.DateAccepted = entityDTO.DateAccepted;
            entityFromDB.Description = entityDTO.Description;
            entityFromDB.DateStart = entityDTO.DateStart;
            entityFromDB.DateFinish = entityDTO.DateFinish;
            entityFromDB.IsFinished = entityDTO.IsFinished;

            entityFromDB.Project = projectFromDB;
            
            return entityFromDB;    

        }
        

    }
}
