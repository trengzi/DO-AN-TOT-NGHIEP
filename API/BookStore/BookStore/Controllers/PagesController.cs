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
    public class PagesController : ControllerBase
    {
        private readonly IPagesService _pagesService;

        public PagesController(IPagesService pageService)
        {
            _pagesService = pageService;
        }

        [HttpGet]
        public async Task<IActionResult> GetPages()
        {
            var pages = await _pagesService.GetPages();
            return Ok(pages);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetPage(Guid id)
        {
            var page = await _pagesService.GetPageById(id);
            return page != null ? Ok(page) : NotFound();
        }

        [HttpPost]
        public async Task<IActionResult> PostPage(Page page)
        {
            return await _pagesService.CreatePage(page)
                ? Ok(new { status = "success" })
                : BadRequest();
        }
    }
}
