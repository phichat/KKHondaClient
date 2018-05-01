export default class ModelCredit {
    public sellAcitvityId: number;  // ประเภทการขาย
    public deposit: number;         // เงินดาวน์ %
    public depositPrice: number;    // เงินดาวน์
    public instalmentEnd: number;   // จำนวนงวด
    public interest: number;        // ดอกเบี้ย
    public remain: number;          // คงเหลือ
    public firstPayment: number;    // ชำระงวดแรก
    public dueDate: number;         // ชำระทุกวันที่
    public nowVat: number;          // vat ณ วันที่ทำสัญญา
};
