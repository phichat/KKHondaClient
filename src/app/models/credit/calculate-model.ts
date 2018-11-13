export class CalculateModel {
    public creditId: number;
    public bookingId: number;
    public typePayment: string;          
    public outStandingPrice: number;     // ยอดหนี้คงเหลือ
    public netPrice: number;             // ราคาสินค้าหลังหักส่วนลด
    public sellTypeId: number;           // ประเภทงานขาย
    public sellAcitvityId: number;       // กิจกรรมการขาย
    public deposit: number;              // เงินดาวน์ %
    public depositPrice: number;         // เงินดาวน์
    public bookDeposit: number;          // เงินมัดจำ
    public instalmentEnd: number;        // จำนวนงวด
    public instalmentPriceExtVat: number;
    public instalmentPrice: number;      // ค่างวด
    public instalmentRemain: number;     // ยอดคงเหลือ
    public carcassPrice: number;         // ราคาซาก
    public interest: number;             // ดอกเบี้ย/เดือน
    public interestPrice: number;        // ราคาดอกเบี้ย
    public remain: number;               // ยอดจัด
    public firstPayment: any;            // ชำระงวดแรก
    public dueDate: number;              // ชำระทุกวันที่
    public promotionalPrice: number;     // ค่าส่งเสริมการขาย
    public nowVat: number;               // vat ณ วันที่ทำสัญญา
    public vatPrice: number;
    public irr: number;                  // internal return rate
    public mrr: number;                  // ดอกเบี้ยต่อปี
    public createBy: number;
    public createDate: Date;
    public updateBy: number;
    public updateDate: string;

    public model: string;
    public logReceiveId: string;
    public engineNo?: string;
    public frameNo?: string;
}
