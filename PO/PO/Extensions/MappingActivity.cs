using PO.Models;
using System.Transactions;

namespace PO.Extensions
{
    public static class MappingActivity
    {
        public static List<ActivityDTORead> MapActivityReadList(this List<Activity> activities)
        {
            var returnResult = new List<ActivityDTORead>();

            int id;
            string activityname, project;
            string? description;
            bool? isfinished;
            DateTime datestart = DateTime.Now;
            DateTime datefinish = DateTime.Now;
            DateTime? dateaccepted = DateTime.Now;

            activities.ForEach(a =>
            {
                id = a.ID;
                activityname = a.activityName;
                description = a.Description;
                isfinished = a.IsFinished;
                datestart = a.DateStart;
                datefinish = a.DateFinish;
                dateaccepted = a.DateAccepted;
                project = null; 
                if (a.ProjectID != null)
                {
                    project = a.ProjectID.ProjectName;
                }

                returnResult.Add(new ActivityDTORead(id, activityname, description, datestart,
                    datefinish, isfinished, dateaccepted, project));

            });

            return returnResult;
        }

        public static ActivityDTORead MapReadActivityToDTO(this Activity a)
        {
            int id;
            string activityname, project;
            string? description;
            bool? isfinished;
            DateTime datestart = DateTime.Now;
            DateTime datefinish = DateTime.Now;
            DateTime? dateaccepted = DateTime.Now;

            id = a.ID;  
            activityname = a.activityName;
            description = a.Description;    
            isfinished = a.IsFinished;

            project = null;
            if(a.ProjectID != null) 
            { 
             project= a.ProjectID.ProjectName;
                           
            }

            dateaccepted = a.DateAccepted;
            datestart = a.DateStart;
            datefinish = a.DateFinish;

            return new ActivityDTORead(id, activityname, description, datestart,
                    datefinish, isfinished, dateaccepted, project);

        }


        public static ActivityDTOInsertUpdate MapActivityInsertUpdateDTO(this Activity a)
        {
            int project = 0;
            string activityname;
            string? description;
            bool? isfinished;
            DateTime datestart = DateTime.Now;
            DateTime datefinish = DateTime.Now;
            DateTime? dateaccepted = DateTime.Now;

            activityname= a.activityName;
            description =a.Description;
            isfinished = a.IsFinished;
            if(a.ProjectID != null)
            {
                project = a.ProjectID.ID;
            }
            datestart = a.DateStart;
            datefinish = a.DateFinish;
            dateaccepted = a.DateAccepted;


            return new ActivityDTOInsertUpdate(activityname, description,datestart,datefinish, 
                isfinished, dateaccepted,project);

        }

        public static Activity MapActivityInsertUpdateFromDTO(this ActivityDTOInsertUpdate dto, Activity a)
        {
            a.activityName = dto.activityname;
            a.Description = dto.decsription;
            a.IsFinished = dto.isFinished;
            a.DateStart = dto.datestart;
            a.DateFinish = dto.datefinished;
            a.DateAccepted = dto.dateaccepted;

            return a;
        } 




    }
}
