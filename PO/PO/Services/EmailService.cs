using FluentEmail.Core;
using PO.Models;

namespace PO.Services
{
    public class EmailService : IEmailService
    {
        private readonly IFluentEmail _iFluentEmail;

        public EmailService(IFluentEmail iFluentEmail)
        {
            _iFluentEmail = iFluentEmail ?? throw new ArgumentNullException(nameof(iFluentEmail));
        }

        public async Task Send(EmailMetadataDTORead dto)
        {
            await _iFluentEmail.To(dto.emailRecipient).Subject(dto.subjectActivity).Body(dto.subjectBody).SendAsync();
        }

        public async Task SendUsingTemplateFromFile(EmailMetadataDTORead dto, Member member, string templateName)
        {
            await _iFluentEmail.To(dto.emailRecipient).UsingTemplateFromFile(templateName, member, true).SendAsync();
        }
    }
}
