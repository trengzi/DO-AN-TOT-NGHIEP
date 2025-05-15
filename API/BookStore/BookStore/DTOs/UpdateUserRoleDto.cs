namespace BookStore.DTOs
{
    public class UpdateUserRoleDto
    {
        public Guid UserId { get; set; }
        public int Role { get; set; }
    }
}
