using System;
using System.Collections.Generic;

namespace BookStore.Models;

public partial class OrderDetail
{
    public Guid Id { get; set; }

    public int? Quantity { get; set; }

    public double? UnitPrice { get; set; }

    public DateTime? Created { get; set; }

    public Guid? BookId { get; set; }

    public Guid? OrderId { get; set; }

    public virtual Book? Book { get; set; }

    public virtual Order? Order { get; set; }
}
