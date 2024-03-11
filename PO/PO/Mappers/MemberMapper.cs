using AutoMapper;
using PO.Models;

namespace PO.Mappers
{
    public class MemberMapper
    {
        public static Mapper MembersMapperReadToDTO()
        {
            return new Mapper(
                new MapperConfiguration( c=>
                {
                    c.CreateMap<Member, MemberDTORead>();
                })
                );
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

        public static Mapper MemberInsertUpdateFromDTO()
        {
            return new Mapper(
                new MapperConfiguration(c =>
                {
                    c.CreateMap<MemberDTOInsertUpdate, Member>();
                }
                ));
        }



    }
}
