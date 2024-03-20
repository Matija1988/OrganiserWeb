using Microsoft.CodeAnalysis.CSharp.Syntax;
using Microsoft.CodeAnalysis.Elfie.Diagnostics;
using PO.Mappers;
using PO.Models;

namespace PO.Extensions
{
    public static class MappingMember
    {
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

        public static MemberDTOInsertUpdate MapMemberInsertUpdateToDTO(this Member member)
        {
            var mapper = MemberMapper.MemberInsertUpdateToDTO();
            return mapper.Map<MemberDTOInsertUpdate>(member);
        }

        public static Member MapSmjerInsertUpdateFromDTO(this MemberDTOInsertUpdate dto, Member member)
        {
           member.FirstName = dto.FirstName;
            member.LastName = dto.LastName;
            member.Username = dto.Username; 
            member.Password = dto.Password;
            member.Email = dto.Email;
            member.IsTeamLeader = dto.IsTeamLeader; 
            return member;
        }

    }
}
