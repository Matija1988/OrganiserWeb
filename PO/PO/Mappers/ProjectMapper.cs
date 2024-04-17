using AutoMapper;
using PO.Models;

namespace PO.Mappers
{
    public class ProjectMapper : Mapping<Project, ProjectDTORead, ProjectDTOInsertUpdate>
    {
        public ProjectMapper()
        {
            MapperReadProjectKillSwitchDTO = new Mapper(
                    new MapperConfiguration(c =>
                    {
                        c.CreateMap<Project, ProjectDTOKillswitch>()
                        .ConstructUsing(entity =>
                        new ProjectDTOKillswitch(
                            entity.ProjectName
                            ));
                    })
                    );
        }
    }
}
