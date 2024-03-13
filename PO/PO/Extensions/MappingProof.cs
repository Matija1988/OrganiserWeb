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

            int id;
            string activity;
            string? documentname, location, member;
            DateTime? datecreated = DateTime.Now;

            proofs.ForEach(p =>
            {
                id = p.ID; 
                documentname = p.DocumentName;
                location = p.Location;
                activity = null;
                if(p.ActivityID != null)
                {
                    activity = p.ActivityID.activityName;
                }
                member = null;
                if(p.MemberID != null) 
                { 
                member = p.MemberID.FirstName + " " + p.MemberID.LastName;
                }
                datecreated = p.DateCreated;

                entityList.Add(new ProofDTORead(id, documentname, member, location, datecreated, activity));

            });

            return entityList;
        }

        public static ProofDTORead MapProofReadToDTO(this ProofOfDelivery entity)
        {
            int id;
            string activity;
            string? documentname, location, member;
            DateTime? datecreated = DateTime.Now;

            id = entity.ID;
            documentname= entity.DocumentName;
            location = entity.Location;
            activity = null;
            if (entity.ActivityID != null)
            {
                activity = entity.ActivityID.activityName;
            }
            member = null;
            if (entity.MemberID != null)
            {
                member = entity.MemberID.FirstName + " " + entity.MemberID.LastName;
            }
            datecreated = entity.DateCreated;


            return new ProofDTORead(id, documentname, member, location, datecreated, activity);
        }

        public static ProofDTOInsertUpdate MapProofInsertUpdateToDTO(this ProofOfDelivery entity)
        {
            int member = 0;
            int activity = 0;
            string? documentname, location;
            DateTime? datecreated = DateTime.Now;

            documentname = entity.DocumentName;
            location = entity.Location;

            if (entity.ActivityID != null)
            {
                activity = entity.ActivityID.ID;
            }
            if (entity.MemberID != null)
            {
                member = entity.MemberID.ID;
            }
            datecreated = entity.DateCreated;
            return new ProofDTOInsertUpdate(documentname, member, location, datecreated, activity);
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
