using AutoMapper;
using PO.Models;

namespace PO.Mappers
{
    public class ActivityMapper
    {
        public static Mapper InitReadToDTO()
        {
            return new Mapper(
                new MapperConfiguration(c =>
                {
                    c.CreateMap<Activity, ActivityDTORead>()
                    .ConstructUsing(entity =>
                    new ActivityDTORead(
                        entity.ID,
                        entity.activityName,
                        entity.Description,
                        entity.DateStart,
                        entity.DateFinish,
                        entity.IsFinished,
                        entity.DateAccepted,
                        entity.ProjectID == null ? "" : entity.ProjectID.ProjectName

                        ));
                        
                })
                );
        }

        public static Mapper InitInsertUpdateToDTO()
        {
            return new Mapper(
                new MapperConfiguration(c =>
                {
                    c.CreateMap<Activity, ActivityDTOInsertUpdate>()
                    .ConstructUsing(entity =>
                    new ActivityDTOInsertUpdate(
                        entity.activityName,
                        entity.Description,
                        entity.DateStart,
                        entity.DateFinish,
                        entity.IsFinished,
                        entity.DateAccepted,
                        entity.ProjectID == null ? null : entity.ProjectID.ID
                        )); 
                })
                );
        }


    }
}
