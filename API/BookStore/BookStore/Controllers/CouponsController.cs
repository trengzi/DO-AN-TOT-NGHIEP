using BookStore.Models;
using Microsoft.AspNetCore.Mvc;

[Route("api/[controller]")]
[ApiController]
public class CouponsController : ControllerBase
{
    private readonly ICouponService _couponService;

    public CouponsController(ICouponService couponService)
    {
        _couponService = couponService;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<Coupon>>> GetCoupons()
    {
        return Ok(await _couponService.GetCouponsAsync());
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<Coupon>> GetCoupon(Guid id)
    {
        var coupon = await _couponService.GetCouponByIdAsync(id);
        return coupon != null ? Ok(coupon) : NotFound();
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> PutCoupon(Guid id, Coupon coupon)
    {
        return await _couponService.UpdateCouponAsync(id, coupon) 
            ? Ok(new { status = "success" }) 
            : BadRequest();
    }

    [HttpPost]
    public async Task<IActionResult> PostCoupon(Coupon coupon)
    {
        return await _couponService.AddCouponAsync(coupon) 
            ? Ok(new { status = "success" }) 
            : BadRequest();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteCoupon(Guid id)
    {
        var status = await _couponService.DeleteCouponAsync(id);
        return Ok(new { status });
    }

    [HttpGet("getAllCouponAvailable")]
    public async Task<ActionResult<IEnumerable<Coupon>>> GetAvailableCoupons()
    {
        var coupons = await _couponService.GetAvailableCouponsAsync();
        return Ok(coupons);
    }
}
