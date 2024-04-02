using AutoMapper;
using PO.Models;

namespace PO.Mappers
{
    public class ProofMapper : Mapping<ProofOfDelivery, ProofDTORead, ProofDTOInsertUpdate>
    {
        public ProofMapper()
        {
                MapperReadToDTO = new Mapper(
                    new MapperConfiguration(
                    c =>
                    {
                        c.CreateMap<ProofOfDelivery, ProofDTORead>()
                        .ConstructUsing(entity =>
                        new ProofDTORead(
                            entity.ID,
                            entity.DocumentName == null ? "" : entity.DocumentName,
                            entity.Member == null ? "" : (entity.Member.FirstName + " " + entity.Member.LastName).Trim(),
                            entity.Location == null ? "" : entity.Location,
                            entity.DateCreated == null ? null : entity.DateCreated,
                            entity.Activity == null ? null : entity.Activity.ActivityName
                            )
                        );
                    })
                    );

            MapperMapInsertUpdatedFromDTO = new Mapper(
                new MapperConfiguration(c =>
                {
                    c.CreateMap<ProofDTOInsertUpdate, ProofOfDelivery>();
                }));
            
               MapperMapInsertUpdateToDTO = new Mapper(
                   new MapperConfiguration(
                       c =>
                       {
                           c.CreateMap<ProofOfDelivery, ProofDTOInsertUpdate>()
                           .ConstructUsing(entity =>
                           new ProofDTOInsertUpdate(
                               entity.DocumentName,
                               entity.Member == null ? null : entity.Member.ID,
                               entity.Location == null ? "" : entity.Location,
                               entity.DateCreated == null ? null : entity.DateCreated,
                               entity.Activity.ID
                               ));
                       }
                       ));
            

        }
    }
}
