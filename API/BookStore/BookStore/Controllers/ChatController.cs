using BookStore.Models.CustomModel;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PusherServer;
using System.Net;
using BookStore.Models;

namespace BookStore.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ChatController : ControllerBase
    {
        private readonly DbBookContext _context;

        public ChatController(DbBookContext context)
        {
            _context = context;
        }

        [HttpPost("messages")]
        public async Task<ActionResult> Message(MessageDTO dto)
        {

            var message = new Chatbox
            {
                UserId = dto.UserId,
                EmployeeId = dto.EmployeeId == Guid.Empty ? null : dto.EmployeeId,
                UserName = dto.UserName,
                Message = dto.Message,
                Created = DateTime.UtcNow
            };
            _context.Chatboxes.Add(message);
            await _context.SaveChangesAsync();

            var options = new PusherOptions
            {
              Cluster = "ap1",
              Encrypted = true
            };

            var pusher = new Pusher(
              "1911170",
              "fec2b4e92fd5692e3fd5",
              "5b4feedec599dd66e1f4",
              options);

            await pusher.TriggerAsync(
              $"chat-{dto.UserId}",
              "message",
              new 
              {
                userId = dto.UserId,
                employeeId = dto.EmployeeId == Guid.Empty ? null : dto.EmployeeId,
                userName = dto.UserName,
                message = dto.Message
              } );

            return Ok();
        }

        [HttpGet("messages/{userId}")]
        public IActionResult GetMessages(Guid userId)
        {
            var messages = _context.Chatboxes
                .Where(m => m.UserId == userId)
                .OrderBy(m => m.Created)
                .ToList();
            return Ok(messages);
        }
    }
}
