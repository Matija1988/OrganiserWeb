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
                    c.CreateMap<Project, ProjectDTORead>();
                })
                );
        }

        public static Mapper ProjectReadFromDTO()
        {
            return new Mapper(
                new MapperConfiguration(
             c =>
             {
                 c.CreateMap<ProjectDTORead, Project>();
             })
             );
        }

        public static Mapper ProjectInsertUpdateToDTO()
        {
            return new Mapper(
               new MapperConfiguration(
                   c =>
                   {
                       c.CreateMap<Project, ProjectDTOInsertUpdate>();
                   }
                   ));
        }

        public static Mapper ProjectInsertUpdateFromDTO()
        {
            return new Mapper(
                new MapperConfiguration(c =>
                {
                    c.CreateMap<ProjectDTOInsertUpdate, Project>();
                }
                ));
        }

    }
}
