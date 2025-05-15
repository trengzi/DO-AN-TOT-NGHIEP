using System;
using System.Collections.Generic;

namespace BookStore.Models;

public partial class Coupon
{
    public Guid Id { get; set; }

    public string? Code { get; set; }

    public double? DiscountPercent { get; set; }

    public DateTime? ValidFrom { get; set; }

    public DateTime? ValidUntil { get; set; }

    public int? MinOrder { get; set; }

    public string? Status { get; set; }

    public DateTime? Created { get; set; }

    public string? Description { get; set; }

    public int? Quantity { get; set; }

    public int? Used { get; set; }

    public virtual ICollection<Order> Orders { get; set; } = new List<Order>();
}
