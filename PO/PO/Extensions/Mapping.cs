using Microsoft.CodeAnalysis.Elfie.Diagnostics;
using PO.Mappers;
using PO.Models;

namespace PO.Extensions
{
    public static class Mapping
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

        public static Project MapProjectInsertUpdateFromDTO(this ProjectDTOInsertUpdate entity)
        {
            var mapper = ProjectMapper.ProjectInsertUpdateFromDTO();
            return mapper.Map<Project>(entity);
        }

        public static List<MemberDTORead> MapMemberReadList(this List<Member> entityList)
        {
            var mapper = MemberMapper.MembersMapperReadToDTO();
            var returnResult = new List<MemberDTORead>();

            entityList.ForEach(entity =>
            {
                returnResult.Add(mapper.Map<MemberDTORead>(entity));
            });
            return returnResult;
        }

        public static MemberDTORead MapMemberReadToDTO(this Member member)
        {
            var mapper = MemberMapper.MembersMapperReadToDTO();
            return mapper.Map<MemberDTORead>(member);
        }

        public static Member MapMemberInsertUpdateFromDTO(this MemberDTOInsertUpdate member)
        {
            var mapper = MemberMapper.MemberInsertUpdateFromDTO();
            return mapper.Map<Member>(member);
        }
    }
}
