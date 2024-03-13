using Microsoft.CodeAnalysis.Elfie.Diagnostics;
using PO.Mappers;
using PO.Models;

namespace PO.Extensions
{
    public static class MappingProject
    {
        public static List<ProjectDTORead> MapProjectReadList(this List<Project> entityList)
        {
            var mapper = ProjectMapper.ProjectInitializeReadToDTO();
            var returnResult = new List<ProjectDTORead>();
            entityList.ForEach(entity =>
            {
                returnResult.Add(mapper.Map<ProjectDTORead>(entity));
            });
            return returnResult;
        }

        public static ProjectDTORead MapProjectReadToDTO(this Project project)
        {
            var mapper = ProjectMapper.ProjectInitializeReadToDTO();
            return mapper.Map<ProjectDTORead>(project);
        }

        public static ProjectDTOInsertUpdate MapProjectInsertUpdateToDTO(this Project entity)
        {
            var mapper = ProjectMapper.ProjectInsertUpdateToDTO();
            return mapper.Map<ProjectDTOInsertUpdate>(entity);
        }

        public static Project MapProjectInsertUpdateFromDTO(this ProjectDTOInsertUpdate dto, Project entity)
        {
            entity.ProjectName = dto.ProjectName;
            entity.UniqueID = dto.UniqueID;
            entity.DateStart = dto.DateStart;
            entity.DateEnd = dto.DateEnd;   
            entity.IsFinished = dto.IsFinished;
            return entity;  
        }

        
    }
}
