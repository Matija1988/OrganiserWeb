using PO.Mappers;
using PO.Models;

namespace PO.Extensions
{
    public static class MappingProof
    {
        public static List<ProofDTORead> MapProofReadList(this List<ProofOfDelivery> proofs)
        {
            var mapper = ProofMapper.ProofInitializeReadToDTO();
            var entityList = new List<ProofDTORead>();

            proofs.ForEach(p =>
            {
                entityList.Add(mapper.Map<ProofDTORead>(p));

            });

            return entityList;
        }

        public static ProofDTORead MapProofReadToDTO(this ProofOfDelivery entity)
        {
            var mapper = ProofMapper.ProofInitializeReadToDTO();
            return mapper.Map<ProofDTORead>(entity);
        }

        public static ProofDTOInsertUpdate MapProofInsertUpdateToDTO(this ProofOfDelivery entity)
        {
            var mapper = ProofMapper.ProofInsertUpdateToDTO();
            return mapper.Map<ProofDTOInsertUpdate>(entity);
        }

        public static ProofOfDelivery MapProofInsertUpdateFromDTO(this ProofDTOInsertUpdate dto, ProofOfDelivery entity)
        {
            entity.DocumentName = dto.documentName;
           
            entity.Location = dto.location;
            entity.DateCreated = dto.datecreated;
            return entity;
        } 

    }
}
