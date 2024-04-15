using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PO.Data;
using PO.Models;
using PO.Services;
using System.Security.AccessControl;

namespace PO.Controllers
{
    [Route("[controller]/[action]")]
    public class EmailController : Controller
    {
        private readonly IEmailService iEmailService;

        private POContext context { get; set; }

        public EmailController(POContext context,IEmailService iEmailService) 
        {
            this.iEmailService = iEmailService;
            this.context = context;
            
        }

        public IActionResult Index()
        {
            return View();
        }

        [HttpGet]
        public async Task<IActionResult> SendEmail(string ReceiverEmail, int activityID)
        {
            try
            {
                var emailTitle = "FluidEmail test mail";
                var recieverName = "TESTER";
                var EmailBody = Common.GetTestMailBody();
                EmailMetadata _EmailMetadata = new(emailTitle, ReceiverEmail, recieverName, EmailBody);
                await iEmailService.Send(_EmailMetadata);
                return Ok("Email sent successfully");
            }
            catch (Exception ex)
            {
                return Ok(ex.Message);
                throw;
            }
        }

        [HttpGet]

        public async Task<IActionResult> SendWithEmailTemplate(string ReceiverEmail, int activityID, int memberID)
        {
            try
            {
                var EmailTitle = "FluentEmail Test email";
                EmailMetadata _EmailMetadata = new(ReceiverEmail, EmailTitle);

                var member = context.members.Where(m => m.ID == memberID).FirstOrDefault();
                var _EmailTemplate = $"{Directory.GetCurrentDirectory()}/Views/Email/EmailTemplate.cshtml";
                await iEmailService.SendUsingTemplateFromFile(_EmailMetadata, member, _EmailTemplate);
                return Ok("Email Send Successfully.");
            }
            catch (Exception ex)
            {
                return Ok(ex.Message);
                throw;
            }
        }
    }
    
}
