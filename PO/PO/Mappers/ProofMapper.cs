using AutoMapper;
using PO.Models;

namespace PO.Mappers
{
    public class ProofMapper
    {
        public static Mapper ProofInitializeReadToDTO()
        {

            return new Mapper(
                new MapperConfiguration(
                c =>
                {
                    c.CreateMap<ProofOfDelivery, ProofDTORead>()
                    .ConstructUsing(entity =>
                    new ProofDTORead(
                        entity.ID,
                        entity.DocumentName,
                        entity.Member == null ? "" : (entity.Member.FirstName + " " + entity.Member.LastName).Trim(),
                        entity.Location,
                        entity.DateCreated,
                        entity.Activity == null ? "" : entity.Activity.activityName
                        )
                    );
                })
                );
        }

        private static string LocationPath (ProofOfDelivery entity)
        {
            return null; 
        }

     

        public static Mapper ProofInsertUpdateToDTO()
        {
            return new Mapper(
               new MapperConfiguration(
                   c =>
                   {
                       c.CreateMap<ProofOfDelivery, ProofDTOInsertUpdate>()
                       .ConstructUsing(entity =>
                       new ProofDTOInsertUpdate(
                           entity.DocumentName,
                           entity.Member == null ? null : entity.Member.ID,
                          entity.Location,
                          entity.DateCreated,
                          entity.Activity.ID
                           ));
                   }
                   ));
        }

    }
}
