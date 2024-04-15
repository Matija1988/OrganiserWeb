﻿using AutoMapper;
using PO.Models;

namespace PO.Mappers
{
    public class MemberMapper : Mapping<Member, MemberDTORead, MemberDTOInsertUpdate>
    {
        public MemberMapper()
        {
               MapperReadToDTO = new Mapper(
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

            MapperReadMemberAuthDTO = new Mapper(
                new MapperConfiguration(c =>
                {
                    c.CreateMap<Member, MemberDTOAuth>()
                    .ConstructUsing(entity =>
                    new MemberDTOAuth(
                        entity.Username,
                        entity.Password
                        ));
                }
                ));

            MapperReadMemberDTOValidation = new Mapper(
                new MapperConfiguration(c =>
                {
                    c.CreateMap<Member, MemberDTOValidation>()
                    .ConstructUsing(entity =>
                    new MemberDTOValidation(
                        entity.Password
                        ));
                }));

        }
    }
}
