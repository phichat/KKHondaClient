export enum BookingPaymentType {
  Cash = 1,
  Leasing = 2,
  HierPurchase = 3,
  Credit = 4
}
export const BookingPaymentTypeList: any[] = [
  { id: BookingPaymentType.Cash, desc: "เงินสด" },
  { id: BookingPaymentType.Leasing, desc: "ไฟแนนซ์" },
  { id: BookingPaymentType.HierPurchase, desc: "เช่าซื้อ" },
  { id: BookingPaymentType.Credit, desc: "ขายเชื่อ" },
];