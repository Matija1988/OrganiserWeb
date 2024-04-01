using AutoMapper;
using PO.Models;

namespace PO.Mappers
{
    /// <summary>
    /// 
    /// </summary>
    public class ActivityMapper
    {
        /// <summary>
        /// 
        /// </summary>
        /// <returns></returns>
        public static Mapper InitReadToDTO()
        {
            return new Mapper(
                new MapperConfiguration(c =>
                {
                    c.CreateMap<Activity, ActivityDTORead>()
                    .ConstructUsing(entity =>
                    new ActivityDTORead(
                        entity.ID,
                        entity.ActivityName,
                        entity.Description == null ? "" : entity.Description,
                        entity.DateStart,
                        entity.DateFinish,
                        entity.IsFinished == null ? null : entity.IsFinished,
                        entity.DateAccepted == null ? null : entity.DateAccepted,
                        entity.AssociatedProject == null ? "" : entity.AssociatedProject.ProjectName

                        ));
                        
                })
                );
        }

        /// <summary>
        /// 
        /// </summary>
        /// <returns></returns>
        public static Mapper InitInsertUpdateToDTO()
        {
            return new Mapper(
                new MapperConfiguration(c =>
                {
                    c.CreateMap<Activity, ActivityDTOInsertUpdate>()
                    .ConstructUsing(entity =>
                    new ActivityDTOInsertUpdate(
                        entity.ActivityName,
                        entity.Description == null ? "No input at this time" : entity.Description,
                        entity.DateStart,
                        entity.DateFinish,
                        entity.IsFinished == null ? null : entity.IsFinished,
                        entity.DateAccepted == null ? null : entity.DateAccepted,
                        entity.AssociatedProject == null ? null : entity.AssociatedProject.ID
                        )); 
                })
                );
        }


    }
}
