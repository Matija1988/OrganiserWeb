using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using PO.Data;
using PO.Models;
using PO.Extensions;
using Microsoft.EntityFrameworkCore;
using System.Text;

namespace PO.Controllers
{

    /// <summary>
    /// Namijenjeno za CRUD operacije nad entitetom members u bazi
    /// Ment for CRUD operations over entity members in DB
    /// </summary>
    [ApiController]
    [Route("api/v1/[controller]")]
    public class MemberController : POController<Member, MemberDTORead, MemberDTOInsertUpdate>
    {
        public MemberController(POContext context) : base(context)
        {
            DbSet = _context.members;
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
                    sb.Append(e.activityName).Append(", ");
                }
                throw new Exception(sb.ToString().Substring(0, sb.ToString().Length - 2));
            }

        }
    }
}
s