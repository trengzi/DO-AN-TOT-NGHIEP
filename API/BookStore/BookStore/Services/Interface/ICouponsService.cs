using BookStore.Models;

public interface ICouponService
{
    Task<IEnumerable<Coupon>> GetCouponsAsync();
    Task<Coupon?> GetCouponByIdAsync(Guid id);
    Task<bool> UpdateCouponAsync(Guid id, Coupon coupon);
    Task<bool> AddCouponAsync(Coupon coupon);
    Task<string> DeleteCouponAsync(Guid id);
    Task<IEnumerable<Coupon>> GetAvailableCouponsAsync();
}
