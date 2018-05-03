export class ModelCredit {
    public sellType: number;        // ประเภทงานขาย
    public sellAcitvityId: number;  // กิจกรรมการขาย
    public deposit: number;         // เงินดาวน์ %
    public depositPrice: number;    // เงินดาวน์
    public instalmentEnd: number;   // จำนวนงวด
    public instalmentPrice: number; // ค่างวด
    public interest: number;        // ดอกเบี้ย/ปี
    public remain: number;          // คงเหลือ/ยอดจัด
    public firstPayment: string;    // ชำระงวดแรก
    public dueDate: number;         // ชำระทุกวันที่
    public nowVat: number;          // vat ณ วันที่ทำสัญญา
};
