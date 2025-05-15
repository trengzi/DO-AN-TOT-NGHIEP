using BookStore.Enum;
using BookStore.Models;
using BookStore.Services;
using BookStore.Services.Interface;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace BookStore.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class OrdersController : ControllerBase
    {
         private readonly IOrdersService _ordersService;

        public OrdersController(IOrdersService ordersService)
        {
            _ordersService = ordersService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Order>>> GetOrders()
        {
            var rs = await _ordersService.GetOrders();
            return Ok(rs);
        }

        [HttpGet("orderAdmin/{page}")]
        public async Task<ActionResult<object>> GetOrdersAdmin(int page)
        {
             var rs = await _ordersService.GetOrdersAdmin(page);
            return Ok(rs);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Order>> GetOrder(Guid id)
        {

             var rs = await _ordersService.GetOrder(id);
            if (rs == null)
                return NotFound();
            return Ok(rs);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> PutOrder(Guid id, Order Order)
        {
             var rs = await _ordersService.PutOrder(id, Order);
            if (rs == 0)
                return BadRequest();
            if (rs == 1)
                return NotFound();
            return NoContent();
        }

        [HttpPost]
        public async Task<ActionResult<Order>> PostOrder(Order Order)
        {
             await _ordersService.PostOrder(Order);
            return CreatedAtAction("GetOrder", new { id = Order.Id }, Order);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteOrder(Guid id)
        {
             var rs = await _ordersService.DeleteOrder(id);
            if (rs)
                return NoContent();
            return NotFound();
        }

        [HttpGet("getlistdonhangbyaccountid/{id}")]
        public async Task<ActionResult<Order>> getListDonHangByAccountId(Guid id)
        {
             var rs = await _ordersService.getListDonHangByAccountId(id);
            if(rs == null)
                return NotFound();
            return Ok(rs);
        }

        [HttpPut("huyDonHang/{id}")]
        public async Task<IActionResult> HuyDonHang(Guid id, Order Order)
        {
             var rs = await _ordersService.HuyDonHang(id, Order);
            if (rs == 0)
                return BadRequest();
            if (rs == 1)
                return NotFound();
            return NoContent();
        }

        [HttpGet("changeStatusUp/{id}")]
        public async Task<IActionResult> ChangeStatusUp(Guid id)
        {
             var rs = await _ordersService.ChangeStatusUp(id);
            return Ok(rs);
        }

        [HttpGet("changeStatusDown/{id}")]
        public async Task<IActionResult> ChangeStatusDown(Guid id)
        {
             var rs = await _ordersService.ChangeStatusDown(id);
            return Ok(rs);
        }

        [HttpGet("getAllEmployee")]
        public async Task<ActionResult<IEnumerable<Employee>>> GetAllEmployee()
        {
            var rs = await _ordersService.GetAllEmployee();
            return Ok(rs);
        }

        [HttpGet("getAllEmployee/{managerId}")]
        public async Task<ActionResult<IEnumerable<Employee>>> GetAllEmployee(Guid managerId)
        {
             var rs = await _ordersService.GetAllEmployee(managerId);
            return Ok(rs);
        }

        [HttpPut("setEmployeeForOrder/{orderId}/{employeeId}")]
        public async Task<IActionResult> SetEmployeeForOrder(Guid orderId, Guid employeeId)
        {
            var rs = await _ordersService.SetEmployeeForOrder(orderId, employeeId);
            return Ok(rs);
        }

        [HttpGet("getAllOrderByEmployeeId/{employeeId}")]
        public async Task<ActionResult<IEnumerable<Order>>> getAllOrderByEmployeeId(Guid employeeId)
        {
            var rs = await _ordersService.getAllOrderByEmployeeId(employeeId);
            return Ok(rs);
        }
    }
}
