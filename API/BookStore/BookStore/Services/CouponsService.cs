using BookStore.Enum;
using BookStore.Models;
using Microsoft.EntityFrameworkCore;

public class CouponService : ICouponService
{
    private readonly DbBookContext _context;

    public CouponService(DbBookContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<Coupon>> GetCouponsAsync()
    {
        return await _context.Coupons.OrderByDescending(x => x.Created).ToListAsync();
    }

    public async Task<Coupon?> GetCouponByIdAsync(Guid id)
    {
        return await _context.Coupons.FindAsync(id);
    }

    public async Task<bool> UpdateCouponAsync(Guid id, Coupon coupon)
    {
        if (id != coupon.Id)
            return false;

        coupon.Created = DateTime.Now;
        _context.Entry(coupon).State = EntityState.Modified;

        try
        {
            await _context.SaveChangesAsync();
            return true;
        }
        catch (DbUpdateConcurrencyException)
        {
            return false;
        }
    }

    public async Task<bool> AddCouponAsync(Coupon coupon)
    {
        coupon.Created = DateTime.Now;
        _context.Coupons.Add(coupon);
        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<string> DeleteCouponAsync(Guid id)
    {
        if (_context.Orders.Any(x => x.CouponId == id))
            return "exist";

        var coupon = await _context.Coupons.FindAsync(id);
        if (coupon == null)
            return "not_found";

        _context.Coupons.Remove(coupon);
        await _context.SaveChangesAsync();
        return "success";
    }

    public async Task<IEnumerable<Coupon>> GetAvailableCouponsAsync()
    {
        var today = DateTime.Today;
        return await _context.Coupons
            .Where(x => x.Status == CouponStatus.khaDung && x.ValidFrom <= today && x.ValidUntil >= today)
            .ToListAsync();
    }
}
