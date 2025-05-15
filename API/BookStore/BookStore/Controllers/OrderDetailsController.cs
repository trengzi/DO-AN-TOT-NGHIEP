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
    public class OrderDetailsController : ControllerBase
    {
        private readonly IOrderDetailsService _orderDetailsService;

        public OrderDetailsController(IOrderDetailsService orderDetailService)
        {
            _orderDetailsService = orderDetailService;
        }

        [HttpGet]
        public async Task<IActionResult> GetOrderDetails()
        {
            var orderDetails = await _orderDetailsService.GetOrderDetails();
            return Ok(orderDetails);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetOrderDetail(Guid id)
        {
            var orderDetail = await _orderDetailsService.GetOrderDetailById(id);
            return orderDetail != null ? Ok(orderDetail) : NotFound();
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> PutOrderDetail(Guid id, OrderDetail orderDetail)
        {
            return await _orderDetailsService.UpdateOrderDetail(id, orderDetail)
                ? NoContent()
                : BadRequest();
        }

        [HttpPost]
        public async Task<IActionResult> PostOrderDetail(IEnumerable<OrderDetail> orderDetails)
        {
            return await _orderDetailsService.CreateOrderDetails(orderDetails)
                ? CreatedAtAction(nameof(GetOrderDetails), new { }, orderDetails)
                : BadRequest();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteOrderDetail(Guid id)
        {
            return await _orderDetailsService.DeleteOrderDetail(id)
                ? NoContent()
                : NotFound();
        }

        [HttpGet("getListSanPhamByIdDonHang/{id}/{userId}")]
        public async Task<IActionResult> GetListSanPhamByIdDonHang(Guid id, Guid userId)
        {
            var result = await _orderDetailsService.GetListSanPhamByIdDonHang(id, userId);
            return result != null ? Ok(result) : NotFound();
        }

        [HttpGet("getListSanPhamByIdDonHangAdmin/{id}")]
        public async Task<IActionResult> GetListSanPhamByIdDonHangAdmin(Guid id)
        {
            var result = await _orderDetailsService.GetListSanPhamByIdDonHangAdmin(id);
            return result != null ? Ok(result) : NotFound();
        }
    }
}
