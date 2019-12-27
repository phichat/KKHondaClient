export enum BookingPaymentType {
    Cash = 1,
    Leasing = 2,
    HierPurchase = 3,
    Credit = 4
}

export const BookingPaymentTypeList: any[] = [
    { id: BookingPaymentType.Cash, name: 'เงินสด' },
    { id: BookingPaymentType.Leasing, name: 'ไฟแนนซ์' },
    { id: BookingPaymentType.HierPurchase, name: 'เช่าซื้อ' },
    { id: BookingPaymentType.Credit, name: 'ขายเชื่อ' }
];
