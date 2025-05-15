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
    public class PublishersController : ControllerBase
    {
        private readonly IPublishersService _publishersService;

        public PublishersController(IPublishersService publisherService)
        {
            _publishersService = publisherService;
        }

        [HttpGet]
        public async Task<IActionResult> GetPublishers()
        {
            var publishers = await _publishersService.GetPublishers();
            return Ok(publishers);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetPublisher(Guid id)
        {
            var publisher = await _publishersService.GetPublisherById(id);
            return publisher != null ? Ok(publisher) : NotFound();
        }

        [HttpPost]
        public async Task<IActionResult> PostPublisher(Publisher publisher)
        {
            return await _publishersService.CreatePublisher(publisher)
                ? Ok(new { status = "success" })
                : BadRequest();
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> PutPublisher(Guid id, Publisher publisher)
        {
            if (id != publisher.Id) return BadRequest();

            publisher.Created = DateTime.UtcNow;
            return await _publishersService.UpdatePublisher(publisher)
                ? Ok(new { status = "success" })
                : NotFound();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePublisher(Guid id)
        {
            var result = await _publishersService.DeletePublisher(id);
            return Ok(new { status = result });
        }
    }
}
