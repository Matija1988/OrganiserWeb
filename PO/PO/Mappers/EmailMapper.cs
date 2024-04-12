using AutoMapper;
using PO.Models;

namespace PO.Mappers
{
    public class EmailMapper : Mapping <EmailMetadata, EmailMetadataDTORead, EmailMetadataInsertUpdate>
    {
        public EmailMapper()
        {
            MapperReadToDTO = new Mapper(
                new MapperConfiguration(c =>
                {
                    c.CreateMap<EmailMetadata, EmailMetadataDTORead>()
                    .ConstructUsing(entity =>
                    new EmailMetadataDTORead(
                        entity.Recipient.Email,
                        entity.Recipient.FirstName + " " + entity.Recipient.LastName,
                        entity.Subject.ActivityName,
                        entity.Subject.Description
                        ));
                })
                );
        }

    }
}
