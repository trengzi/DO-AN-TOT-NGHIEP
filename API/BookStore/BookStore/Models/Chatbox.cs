using System;
using System.Collections.Generic;

namespace BookStore.Models;

public partial class Chatbox
{
    public Guid Id { get; set; }

    public Guid? UserId { get; set; }

    public Guid? EmployeeId { get; set; }

    public string? UserName { get; set; }

    public string? Message { get; set; }

    public DateTime? Created { get; set; }
}
