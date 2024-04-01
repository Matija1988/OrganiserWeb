using PO.Mappers;
using PO.Models;
using System.Transactions;

namespace PO.Extensions
{
    public static class MappingActivity
    {
        public static List<ActivityDTORead> MapActivityReadList(this List<Activity> activities)
        {
            var mapper = ActivityMapper.InitReadToDTO();
            var returnResult = new List<ActivityDTORead>();
           
            activities.ForEach(activity => { 
                returnResult.Add(mapper.Map<ActivityDTORead>(activity)); 
            });  
            
            return returnResult;    

        }

        public static ActivityDTORead MapReadActivityToDTO(this Activity a)
        {
            var mapper = ActivityMapper.InitReadToDTO();
            return mapper.Map<ActivityDTORead>(a);  
        }


        public static ActivityDTOInsertUpdate MapActivityInsertUpdateDTO(this Activity a)
        {
            var mapper = ActivityMapper.InitInsertUpdateToDTO();
            return mapper.Map < ActivityDTOInsertUpdate>(a);

        }

        public static Activity MapActivityInsertUpdateFromDTO(this ActivityDTOInsertUpdate dto, Activity a)
        {
            a.ActivityName = dto.ActivityName;
            a.Description = dto.Description;
            a.IsFinished = dto.IsFinished;
            a.DateStart = dto.DateStart;
            a.DateFinish = dto.DateFinished;
            a.DateAccepted = dto.DateAccepted;

            return a;
        } 




    }
}
