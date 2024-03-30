using AutoMapper;
using PO.Models;

namespace PO.Mappers
{
    public class MemberMapper
    {
        public static Mapper MembersMapperReadToDTO()
        {
            return new Mapper(
                new MapperConfiguration(c =>
                {
                    c.CreateMap<Member, MemberDTORead>()
                    .ConstructUsing(entity =>
                    new MemberDTORead(
                        entity.ID,
                        entity.FirstName,
                        entity.LastName,
                        entity.Username,
                        entity.Password,
                        entity.Email,
                        entity.IsTeamLeader
                        ));
                }));
        }

        public static Mapper MembersReadFromDTO()
        {
            return new Mapper(
                new MapperConfiguration(c =>
                {
                    c.CreateMap<MemberDTORead, Member>();
                }));
        }

        public static Mapper MemberInsertUpdateToDTO()
        {
            return new Mapper(
                new MapperConfiguration(c =>
                {
                    c.CreateMap<Member, MemberDTOInsertUpdate>();
                }));
        }

        
    }
}
