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
                        entity.EmailTitle,
                        entity.RecipientEmail,
                        entity.RecipientName,
                        entity.EmailBody
                        )); 
                })
                );
        }

    }
}
