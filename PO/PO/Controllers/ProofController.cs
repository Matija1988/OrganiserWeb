using AutoMapper.QueryableExtensions;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PO.Data;
using PO.Extensions;
using PO.Models;
using System.IO;
using System.Text;

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
    public class ProofController : POController<ProofOfDelivery, ProofDTORead, ProofDTOInsertUpdate>
    {
        public ProofController(POContext context) : base(context) => DbSet = _context.ProofOfDeliveries;

        protected override ProofOfDelivery UpdateEntity(ProofDTOInsertUpdate entityDTO, ProofOfDelivery entityFromDB)
        {
            var member = _context.members.Find(entityDTO.memberID);
            if (member == null)
            {
                throw new Exception("No entity with id " + entityDTO.memberID + " in database");
            }

            var activity = _context.activities.Find(entityDTO.activityID);

            if(activity == null)
            {
                throw new Exception("No entity with id " + entityDTO.activityID + " in database");
            }

            entityFromDB = entityDTO.MapProofInsertUpdateFromDTO(entityFromDB);

            entityFromDB.Member = member;
            entityFromDB.Activity = activity;

            return entityFromDB;
        }

        protected override ProofOfDelivery FindEntity(int id)
        {
            var entity = _context.ProofOfDeliveries.Include(p => p.Member).Include(p => p.Activity)
                .FirstOrDefault(i => i.ID == id);

            if(entity == null)
            {
                throw new Exception("No entity with id " + id + " in database!");
            }

            return entity;
        }

        protected override List<ProofDTORead> ReadAll()
        {
            var entityList = _context.ProofOfDeliveries
                .Include(p => p.Activity)
                .Include(p => p.Member)
                .ToList();

            if(entityList == null || entityList.Count == 0) 
            {
                throw new Exception("No data in database!");
            }
            return entityList.MapProofReadList();
        }

        protected override ProofDTORead MapRead(ProofOfDelivery entity)
        {
            return entity.MapProofReadToDTO();
        }
        protected override ProofOfDelivery CreateEntity(ProofDTOInsertUpdate entityDTO)
        {
            var member = _context.members.Find(entityDTO.memberID);

            if (member == null)
            {
                throw new Exception("Member with id " + member.ID + " not found");
            }


            var act = _context.activities.Find(entityDTO.activityID);

            if(act == null) 
            {
                throw new Exception("Activity with id " + act.ID + " not found!");
            }

            var entity = entityDTO.MapProofInsertUpdateFromDTO(new ProofOfDelivery());
            entity.Member = member;
            entity.Activity = act;

            return entity;

        }

        protected override void ControlDelete(ProofOfDelivery entity)
        {
            var entityFromDB = _context.ProofOfDeliveries.Find(entity.ID);

            if (entityFromDB == null) 
            { 
                throw new Exception("No data with " + entity.ID + " found. Please check your input!"); 
            }


        }


    }

}
