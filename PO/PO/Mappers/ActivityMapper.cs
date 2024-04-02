using AutoMapper;
using Microsoft.Identity.Client;
using PO.Models;

namespace PO.Mappers
{
    /// <summary>
    /// 
    /// </summary>
    public class ActivityMapper : Mapping<Activity, ActivityDTORead, ActivityDTOInsertUpdate>
    {
        /// <summary>
        /// 
        /// </summary>
        /// <returns></returns>

        public ActivityMapper()
        {
            {
                MapperReadToDTO = new Mapper(
                    new MapperConfiguration(c =>
                    {
                        c.CreateMap<Activity, ActivityDTORead>()
                        .ConstructUsing(entity =>
                        new ActivityDTORead(
                            entity.ID,
                            entity.ActivityName,
                            entity.Description == null ? "" : entity.Description.Trim(),
                            entity.DateStart,
                            entity.DateFinish,
                            entity.IsFinished == null ? null : entity.IsFinished,
                            entity.DateAccepted == null ? null : entity.DateAccepted,
                            entity.AssociatedProject == null ? "" : entity.AssociatedProject.ProjectName
                            ));
                    })
                    );

                MapperMapInsertUpdatedFromDTO = new Mapper(
                    new MapperConfiguration(c =>
                    {
                        c.CreateMap<ActivityDTOInsertUpdate, Activity>();
                    })
                    );
                /// <summary>
                /// 
                /// </summary>
                /// <returns></returns>

                MapperMapInsertUpdateToDTO = new Mapper(
                    new MapperConfiguration(c =>
                    {
                        c.CreateMap<Activity, ActivityDTOInsertUpdate>()
                        .ConstructUsing(entity =>
                        new ActivityDTOInsertUpdate(
                            entity.ActivityName,
                            entity.Description == null ? "No input at this time" : entity.Description.Trim(),
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
}
