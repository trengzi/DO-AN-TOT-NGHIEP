using BookStore.Models;
using BookStore.Services;
using BookStore.Services.Interface;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace BookStore.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MessagesController : ControllerBase
    {
        private readonly IMessagesService _messagesService;

        public MessagesController(IMessagesService messageService)
        {
            _messagesService = messageService;
        }

        [HttpGet]
        public async Task<IActionResult> GetMessages()
        {
            var messages = await _messagesService.GetMessages();
            return Ok(messages);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetMessage(Guid id)
        {
            var message = await _messagesService.GetMessageById(id);
            return message != null ? Ok(message) : NotFound();
        }

        [HttpPost]
        public async Task<IActionResult> PostMessage(Message message)
        {
            return await _messagesService.CreateMessage(message)
                ? Ok(new { status = "success" })
                : BadRequest();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteMessage(Guid id)
        {
            return await _messagesService.DeleteMessage(id)
                ? Ok(new { status = "success" })
                : NotFound();
        }
    }
}
