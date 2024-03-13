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
                    c.CreateMap<ProofOfDelivery, ProofDTORead>();
                })
                );
        }

        public static Mapper ProofReadFromDTO()
        {
            return new Mapper(
                new MapperConfiguration(
             c =>
             {
                 c.CreateMap<ProofDTORead, ProofOfDelivery>();
             })
             );
        }

        public static Mapper ProofInsertUpdateToDTO()
        {
            return new Mapper(
               new MapperConfiguration(
                   c =>
                   {
                       c.CreateMap<ProofOfDelivery, ProofDTOInsertUpdate>();
                   }
                   ));
        }

        public static Mapper ProofInsertUpdateFromDTO()
        {
            return new Mapper(
                new MapperConfiguration(c =>
                {
                    c.CreateMap<ProofDTOInsertUpdate, ProofOfDelivery>();
                }
                ));
        }
    }
}
