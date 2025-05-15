using System;
using System.Collections.Generic;

namespace BookStore.Models;

public partial class Manager
{
    public Guid Id { get; set; }

    public string? FullName { get; set; }

    public string? Address { get; set; }

    public string? Email { get; set; }

    public string? Phone { get; set; }

    public string? Branch { get; set; }

    public DateTime? Created { get; set; }

    public int? Salary { get; set; }

    public virtual ICollection<Employee> Employees { get; set; } = new List<Employee>();
}
