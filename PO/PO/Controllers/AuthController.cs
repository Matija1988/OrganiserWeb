using PO.Models;
using PO.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Text;
using Microsoft.AspNetCore.Mvc.ModelBinding;

namespace PO.Controllers
{
    [ApiController]
    [Route("api/v1/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly POContext _context;

        public AuthController(POContext context)
        {
            _context = context;
        }

        [HttpPost("token")]
        public IActionResult GenerateToken(MemberDTOAuth user)
        {
            if(!ModelState.IsValid) { return BadRequest(ModelState); }

            var userBase = _context.members.Where(p => p.Email!.Equals(user.Email)).FirstOrDefault();

            if(userBase == null) 
            {
                return StatusCode(StatusCodes.Status403Forbidden, "You are not authorized to preform this action!");
            }

            if(!BCrypt.Net.BCrypt.Verify(user.Password, userBase.Password)) 
            {
                return StatusCode(StatusCodes.Status403Forbidden, "You are not authorized to preform this action!");
            }

            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.UTF8.GetBytes("FaceInTheMirrorAllSkinAndBoneBloodshotEyesAnd a heart of stone");

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Expires = DateTime.UtcNow.Add(TimeSpan.FromHours(8)),
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256)
            };

            var token = tokenHandler.CreateToken(tokenDescriptor);
            var jwt = tokenHandler.WriteToken(token);

            return Ok(jwt);

        }

    }
}
