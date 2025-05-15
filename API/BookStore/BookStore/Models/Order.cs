using System;
using System.Collections.Generic;

namespace BookStore.Models;

public partial class Order
{
    public Guid Id { get; set; }

    public double? TotalPrice { get; set; }

    public string? Status { get; set; }

    public DateTime? Created { get; set; }

    public Guid? UserId { get; set; }

    public string? Address { get; set; }

    public string? PaymentMethod { get; set; }

    public string? ShippingMethod { get; set; }

    public string? Note { get; set; }

    public string? PhoneNumber { get; set; }

    public Guid? CouponId { get; set; }

    public string? Code { get; set; }

    public Guid? EmployeeId { get; set; }

    public DateTime? ReceiptDate { get; set; }

    public DateTime? SolveDate { get; set; }

    public virtual Coupon? Coupon { get; set; }

    public virtual Employee? Employee { get; set; }

    public virtual ICollection<OrderDetail> OrderDetails { get; set; } = new List<OrderDetail>();

    public virtual ICollection<Review> Reviews { get; set; } = new List<Review>();

    public virtual User? User { get; set; }
}
