namespace BookStore.Models.CustomModel
{
    public class LoginUser
    {
        public string UserName { get; set; }
        public string Password { get; set; }
    }

    public class ChangePasswordModel
    {
        public string email { get; set; }
        public string OldPass { get; set; }
        public string NewPass { get; set; }
    }

    public class CheckBookModel
    {
        public Guid id { get; set; }
        public int soLuong { get; set; }
    }

    public class TokenModel
    {
        public string token { get; set; }
    }

    public class MessageDTO
    {
        public Guid UserId { get; set; }
        public Guid? EmployeeId { get; set; }
        public string UserName { get; set; }
        public string Message { get; set; }
    }

    public class ProductUpdateDto
    {
        public Guid ProductId { get; set; }
        public int Bought { get; set; }
    }
}
