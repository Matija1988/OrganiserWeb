using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.StaticFiles;
using Microsoft.Build.Construction;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using PO.Data;
using PO.Mappers;
using PO.Models;
using System.Data.OleDb;
using System.IO.Compression;
using System.Net.Mime;

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
        public IWebHostEnvironment _enviroment;
        public ProofController(POContext context) : base(context)
        {
            DbSet = _context.ProofOfDeliveries;
            _mapper = new ProofMapper();
        }

        protected override ProofOfDelivery UpdateEntity(ProofDTOInsertUpdate entityDTO, ProofOfDelivery entityFromDB)
        {
            var member = _context.members.Find(entityDTO.memberID)
                ?? throw new Exception("No entity with id " + entityDTO.memberID + " in database");
            var activity = _context.activities.Find(entityDTO.activityID)
                ?? throw new Exception("No entity with id " + entityDTO.activityID + " in database");
            entityFromDB = _mapper.MapInsertUpdatedFromDTO(entityDTO);

            entityFromDB.Member = member;
            entityFromDB.Activity = activity;

            return entityFromDB;
        }

        protected override ProofOfDelivery FindEntity(int id)
        {
            var entity = _context.ProofOfDeliveries.Include(p => p.Member).Include(p => p.Activity)
                .FirstOrDefault(i => i.ID == id);

            if (entity == null)
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

            if (entityList == null || entityList.Count == 0)
            {
                throw new Exception("No data in database!");
            }
            return _mapper.MapReadList(entityList);
        }

        protected override ProofOfDelivery CreateEntity(ProofDTOInsertUpdate entityDTO)
        {
            var member = _context.members.Find(entityDTO.memberID);

            if (member == null)
            {
                throw new Exception("Member with id " + member.ID + " not found");
            }


            var act = _context.activities.Find(entityDTO.activityID);

            if (act == null)
            {
                throw new Exception("Activity with id " + act.ID + " not found!");
            }

            var entity = _mapper.MapInsertUpdatedFromDTO(entityDTO);
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

        [HttpPatch]
        [Route("{proofID:int}")]

        public async Task<ActionResult> Patch(int proofID, IFormFile file)
        {
            if (file == null) return BadRequest("No file set for upload");

            var entityFromDb = _context.ProofOfDeliveries.Find(proofID);

            if (entityFromDb == null) return BadRequest("No entity with id " + proofID + " in database.");

            try
            {
                var ds = Path.DirectorySeparatorChar;

                string dir = Path.Combine(Directory.GetCurrentDirectory()
                    + ds + "wwwroot" + ds + "file" + ds + "proof");
         
                if (!System.IO.Directory.Exists(dir))
                {
                    System.IO.Directory.CreateDirectory(dir);
                }

                var filePath = Path.Combine(dir + ds + proofID + "_" + System.IO.Path.GetExtension(file.FileName));
                Stream fileStram = new FileStream(filePath, FileMode.Create);
                await file.CopyToAsync(fileStram);

                entityFromDb.Location = filePath;

                _context.ProofOfDeliveries.Update(entityFromDb);
                _context.SaveChanges();

                return Ok("File uploaded");

            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }

        }

        [HttpGet]
        [Route("getFile/{proofID:int}")]

        public async Task<ActionResult> downloadFile(int proofID)
        {
            var proof = _context.ProofOfDeliveries.Find(proofID);

            if (proof == null) return BadRequest("No entity with id " + proofID + " in database.");

            if (proof.Location == null) return NotFound("The requested entity does not have an associated file.");

            try
            {
                var ds = Path.DirectorySeparatorChar;

                string fullPath = proof.Location;

                var fileContent = System.IO.File.ReadAllBytes(fullPath);

                if (fileContent == null) return BadRequest("Not found");

                return File(fileContent, MediaTypeNames.Application.Octet, proof.DocumentName + System.IO.Path.GetExtension(proof.Location));

            }
            catch (Exception ex)
            {

                return BadRequest(ex.Message);

            }

        }

        [HttpGet]
        [Route("getPagination/{page}")]
        public IActionResult GetPagination(int page, string condition = "")
        {
            var byPage = 8;
            condition = condition.ToLower();

            try
            {
                var proof = _context.ProofOfDeliveries.Include(m => m.Member).Include(a => a.Activity).Where(
                    p => EF.Functions.Like(p.DocumentName.ToLower(), "%" + condition + "%")
                    || EF.Functions.Like(p.Activity.ActivityName.ToLower(), "%" + condition + "%"))
                    .Skip((byPage * page) - byPage)
                    .Take(byPage)
                    .OrderBy(p => p.DocumentName)
                    .ToList();

                return new JsonResult(_mapper.MapReadList(proof));
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }


        //[HttpGet]
        //[Route("Proofs/download/{int:id}")]

        //public IActionResult DownloadFile(int id)
        //{
        //    byte[] fileBytes;
        //    var proof = _context.ProofOfDeliveries.Find(id);





        //    return null;
        //}

    }

}
