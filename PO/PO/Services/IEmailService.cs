using PO.Models;

namespace PO.Services
{
    public interface IEmailService
    {
        Task Send(EmailMetadataDTORead dto);

        Task SendUsingTemplateFromFile(EmailMetadataDTORead dto, Member member,  string templateName);
    }
}
