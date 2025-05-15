namespace BookStore.Enum
{
    public class Enum
    {

    }

    public static class  CouponStatus
    {
        public const string khaDung = "Đang khả dụng";
        public const string hetHan = "Không khả dụng";
    }
    public static class  OrderStatus
    {
        public const string  ChoXacNhan = "Chờ xác nhận";
        public const string  DaHuy = "Đã hủy";
        public const string  DangChuanBiHang = "Đang chuẩn bị hàng";
        public const string  DangGiaoHang = "Đang giao hàng";
        public const string  GiaoHangThanhCong = "Giao hàng thành công";
    }
}
