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
           
            activities.ForEach(activity => { returnResult.Add(mapper.Map<ActivityDTORead>(activity)); });  
            
            return returnResult;    


            //int id;
            //string activityname, project;
            //string? description;
            //bool? isfinished;
            //DateTime datestart = DateTime.Now;
            //DateTime datefinish = DateTime.Now;
            //DateTime? dateaccepted = DateTime.Now;

            //activities.ForEach(a =>
            //{
            //    id = a.ID;
            //    activityname = a.activityName;
            //    description = a.Description;
            //    isfinished = a.IsFinished;
            //    datestart = a.DateStart;
            //    datefinish = a.DateFinish;
            //    dateaccepted = a.DateAccepted;
            //    project = a.ProjectID.ProjectName; 
            //    if (a.ProjectID.ProjectName == null)
            //    {
            //        project = null;
            //    }

            //    returnResult.Add(new ActivityDTORead(id, activityname, description, datestart,
            //        datefinish, isfinished, dateaccepted, project));

            //});

            //return returnResult;
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
            a.activityName = dto.activityname;
            a.Description = dto.description;
            a.IsFinished = dto.isFinished;
            a.DateStart = dto.datestart;
            a.DateFinish = dto.datefinished;
            a.DateAccepted = dto.dateaccepted;

            return a;
        } 




    }
}
