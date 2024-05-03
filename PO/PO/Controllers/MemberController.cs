using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using PO.Data;
using PO.Models;
using Microsoft.EntityFrameworkCore;
using System.Text;
using PO.Mappers;
using BCrypt.Net;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http.HttpResults;

namespace PO.Controllers
{
    
    /// <summary>
    /// Namijenjeno za CRUD operacije nad entitetom members u bazi
    /// Ment for CRUD operations over entity members in DB
    /// </summary>
    [ApiController]
    [Route("api/v1/[controller]")]
    [Authorize(Roles = "TeamLeader")]
    public class MemberController : POController<Member, MemberDTORead, MemberDTOInsertUpdate>
    {
        public MemberController(POContext context) : base(context)
        {
            DbSet = _context.members;
        }

        [HttpGet]
        [Route("Members/SearchByName/{input}")]

        public IActionResult SearchMembersByName(string input)
        {
            if (!ModelState.IsValid || input == null)
            {
                return BadRequest();
            }

            input = input.ToLower();

            try
            {
                var member = _context.members.Where(m=> m.FirstName.ToLower().Contains(input) 
                || m.LastName.ToLower().Contains(input)).ToList();

                if (member == null)
                {
                    return new EmptyResult();
                }

                return new JsonResult(_mapper.MapReadList(member));

            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status503ServiceUnavailable, ex.Message);

            }

        }

        protected override Member CreateEntity(MemberDTOInsertUpdate dto)
        {
            var passwordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password, 12);

           var entity =  _mapper.MapInsertUpdatedFromDTO(dto);

            entity.Password = passwordHash;

            return entity;
        }

        protected override Member UpdateEntity(MemberDTOInsertUpdate entityDTO, Member entityFromDB)
        {
            if(entityDTO.Password == entityFromDB.Password) { throw new Exception("Password must be changed!"); }

            var passwordHash = BCrypt.Net.BCrypt.HashPassword(entityDTO.Password, 12);
            
            entityFromDB.FirstName = entityDTO.FirstName;
            entityFromDB.LastName = entityDTO.LastName;
            entityFromDB.Username = entityDTO.Username;
            entityFromDB.Password = passwordHash;
            entityFromDB.IsTeamLeader = entityDTO.IsTeamLeader;
            entityFromDB.Roles = entityDTO.Roles;

            return entityFromDB;
        }
        
        protected override List<MemberDTORead> ReadAll()
        {
            var entityList = _context.members.ToList();

            if(entityList == null || entityList.Count == 0)
            {
                throw new Exception("No data in database!");
            }

            return _mapper.MapReadList(entityList); 
        }

        protected override void ControlDelete(Member entity)
        {
            var entityFromDB = _context.members.Include(x => x.IActivities).FirstOrDefault(x => x.ID == entity.ID);

            if (entityFromDB == null) 
            { 
            throw new Exception("Member with "  +  entity.ID + " not found. Please check your input!");  
            }

            if(entityFromDB != null && entityFromDB.IActivities.Count() > 0)
            {
                StringBuilder sb = new StringBuilder();
                sb.Append("Cannot delete member: Member is placed in activities: ");
                foreach(var e in  entityFromDB.IActivities)
                {
                    sb.Append(e.ActivityName).Append(", ");
                }
                throw new Exception(sb.ToString().Substring(0, sb.ToString().Length - 2));
            }

        }
    }
}
