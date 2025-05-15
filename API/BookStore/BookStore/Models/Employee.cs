using System;
using System.Collections.Generic;

namespace BookStore.Models;

public partial class Employee
{
    public Guid Id { get; set; }

    public string? FullName { get; set; }

    public string? Address { get; set; }

    public string? Email { get; set; }

    public string? Phone { get; set; }

    public int? Salary { get; set; }

    public DateTime? HiredDate { get; set; }

    public DateTime? Created { get; set; }

    public Guid? ManagerId { get; set; }

    public virtual Manager? Manager { get; set; }

    public virtual ICollection<Order> Orders { get; set; } = new List<Order>();
}
