using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Build.Exceptions;
using Microsoft.EntityFrameworkCore;
using PO.Data;
using PO.Mappers;
using PO.Models;

namespace PO.Controllers
{
    public abstract class POController<T, TDR, TDI> : ControllerBase where T : Entity
    {
        protected DbSet<T> DbSet;

        private Mapping<T, TDR, TDI> _mapper;
        protected abstract void ControlDelete(T entity);

        protected readonly POContext _context;

        public POController(POContext context)
        {
            _context = context;
            _mapper = new Mapping<T, TDR, TDI>();
        }

        [HttpGet]

        public IActionResult Get()
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                return new JsonResult(ReadAll());
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet]
        [Route("{id:int}")]
        public IActionResult GetById(int id)
        {
            if (!ModelState.IsValid || id <= 0) { return BadRequest(ModelState); }

            try
            {
                var entity = FindEntity(id);
                return new JsonResult(MapRead(entity));
            } catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
        

        /// <summary>
        /// 
        /// </summary>
        /// <param name="entityDTO"></param>
        /// <returns></returns>
        [HttpPost]
        public IActionResult Post(TDI entityDTO)
        {
            if (!ModelState.IsValid || entityDTO == null) { return BadRequest(ModelState); }

            try
            {
                var entity = CreateEntity(entityDTO);
                _context.Add(entity);
                _context.SaveChanges();

                return StatusCode(StatusCodes.Status201Created, MapRead(entity));
            } catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPut]
        [Route("{id:int}")]

        public IActionResult Put(int id, TDI entityDTO)
        {
            if (id <= 0 || !ModelState.IsValid || entityDTO == null)
            {
                return BadRequest(ModelState);
            }

            try
            {
                var entityFromDB = FindEntity(id);
                _context.Entry(entityFromDB).State = EntityState.Detached;
                var entity = UpdateEntity(entityDTO, entityFromDB);
                entity.ID = id;
                _context.Update(entity);
                _context.SaveChanges();

                return StatusCode(StatusCodes.Status200OK, MapRead(entity));

            } catch(Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpDelete]
        [Route("{id:int}")]

        public IActionResult Delete (int id)
        {
            if(!ModelState.IsValid || id <= 0) { return BadRequest(); }

            try
            {
                var entityFromDB = FindEntity(id);
                ControlDelete(entityFromDB);
                _context.Remove(entityFromDB);
                _context.SaveChanges();
                return Ok("Entity deleted");
            } catch (Exception ex)
            {
                return BadRequest(ex.Message);  
            }
        }

        
        protected virtual T UpdateEntity(TDI entityDTO, T entityFromDB)
        {
            return _mapper.MapInsertUpdateFromDTO(entityDTO);
        }
        protected virtual T CreateEntity(TDI entityDTO)
        {
            return _mapper.MapInsertUpdateFromDTO(entityDTO);
        }

        protected virtual TDR MapRead(T entity)
        {
            return _mapper.MapReadToDTO(entity);
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="entity"></param>
        /// <returns></returns>
        protected virtual TDI MapInsertUpdate(T entity)
        {
            return _mapper.MapInsertUpdateToDTO(entity);
        }
        protected virtual T FindEntity(int id)
        {
            var entityFromDB = DbSet.Find(id);
            if(entityFromDB == null) 
            {
                throw new Exception("No entity with id " + id + " found in database");
            }
            return entityFromDB;
        }

        protected virtual TDR ReadOne(int id)
        {
            return _mapper.MapReadToDTO(DbSet.Find(id));
        }
        protected virtual List<TDR> ReadAll()
        {
            var list = DbSet.ToList();
            if(list == null || list.Count == 0)
            {
                throw new Exception("Database empty");
            }
            return _mapper.MapReadList(list);
        }
    }
}
