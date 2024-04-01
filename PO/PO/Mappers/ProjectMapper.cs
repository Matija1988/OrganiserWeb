using AutoMapper;
using PO.Models;

namespace PO.Mappers
{
    public class ProjectMapper
    {

        public static Mapper ProjectInitializeReadToDTO()
        {

            return new Mapper(
                new MapperConfiguration(
                c =>
                {
                    c.CreateMap<Project, ProjectDTORead>()
                    .ConstructUsing(entity => 
                    new ProjectDTORead(
                        entity.ID,
                        entity.UniqueID,
                        entity.ProjectName,
                        entity.DateStart,
                        entity.DateEnd,
                        entity.IsFinished == null ? null : entity.IsFinished
                        ));
                })
                );
        }


        public static Mapper ProjectInsertUpdateToDTO()
        {
            return new Mapper(
               new MapperConfiguration(
                   c =>
                   {
                       c.CreateMap<Project, ProjectDTOInsertUpdate>()
                       .ConstructUsing(entity =>
                       new ProjectDTOInsertUpdate(
                           entity.UniqueID,
                           entity.ProjectName,
                           entity.DateStart,
                           entity.DateEnd,
                           entity.IsFinished == null ? null : entity.IsFinished
                           
                           ));
                   }
                   ));
        }


    }
}
