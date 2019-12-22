import { EventEmitter } from '@angular/core';
import { DropdownTemplate, DropDownModel } from 'app/models/drop-down-model';
import { FormGroup, FormControl } from '@angular/forms';
import { ContractModel } from 'app/models/credit';
import { IUserResCookie } from 'app/interfaces/users';

export class CalculateConfig {

  mode: string;
  userModel: IUserResCookie;

  engineTypeahead = new EventEmitter<string>();
  engineDropdown: Array<DropdownTemplate>;
  searchEngineLoading = false;
  searchEngineLoadingTxt = '';

  contractHireTypeahead = new EventEmitter<string>();
  contractHireDropdown: Array<DropDownModel>;
  contractHireLoading: boolean;
  contractHireLoadingTxt: string;

  contractOwnerTypeahead = new EventEmitter<string>();
  contractOwnerDropdown: Array<DropDownModel>;
  contractOwnerLoading: boolean;
  contractOwnerLoadingTxt: string;

  bookingNo: string;

  dueDate = [
    { value: 5, text: '5 ของเดือน' },
    { value: 10, text: '10 ของเดือน' },
    { value: 15, text: '15 ของเดือน' },
    { value: 20, text: '20 ของเดือน' },
    { value: 25, text: '25 ของเดือน' },
  ]

  contractModel = new ContractModel();
  contractItemModel = new Array<ContractModel>();
  formCalculate: FormGroup = new FormGroup({
    creditId: new FormControl(0),
    bookingId: new FormControl(0),
    typePayment: new FormControl('0'),
    outStandingPrice: new FormControl(0),    // ยอดหนี้คงเหลือ
    netPrice: new FormControl(0),             // ราคาสินค้าหลังหักส่วนลด
    sellTypeId: new FormControl(0),           // ประเภทงานขาย
    sellAcitvityId: new FormControl(0),       // กิจกรรมการขาย
    deposit: new FormControl(0),              // เงินดาวน์ %
    depositPrice: new FormControl(0),         // เงินดาวน์
    bookDeposit: new FormControl(0),          // เงินมัดจำ
    instalmentEnd: new FormControl(0),        // จำนวนงวด
    instalmentPriceExtVat: new FormControl(0),
    instalmentPrice: new FormControl(0),      // ค่างวด
    instalmentRemain: new FormControl(0),     // ยอดคงเหลือ
    carcassPrice: new FormControl(0),         // ราคาซาก
    interest: new FormControl(0),             // ดอกเบี้ย/เดือน
    interestPrice: new FormControl(0),        // ราคาดอกเบี้ย
    remain: new FormControl(0),               // ยอดจัด
    firstPayment: new FormControl(new Date()),// ชำระงวดแรก
    dueDate: new FormControl(0),              // ชำระทุกวันที่
    promotionalPrice: new FormControl(0),     // ค่าส่งเสริมการขาย
    nowVat: new FormControl(0),               // vat ณ วันที่ทำสัญญา
    vatPrice: new FormControl(0),
    irr: new FormControl(0),                  // internal return rate
    mrr: new FormControl(0),                  // ดอกเบี้ยต่อปี
    saleBy: new FormControl(0),
    saleDate: new FormControl(new Date()),
    updateBy: new FormControl(0),
    updateDate: new FormControl(''),
    bookingPaymentType: new FormControl(0),  // ประเภทการซื้อ 1=สด, 2=สินเชื่อ, 3=เช่าซื้อ, 4=ขายเชื่อ
    returnDeposit: new FormControl('1'),
    returnDepositPrice: new FormControl(0),
    model: new FormControl(''),
    logReceiveId: new FormControl(''),
    engineNo: new FormControl(''),
    frameNo: new FormControl(''),

    fiCode: new FormControl(null),
    fiintId: new FormControl(null),
    fiComId: new FormControl(null),
    comPrice: new FormControl(0),

    contractHire: new FormControl(''),
    contractOwner: new FormControl('')
  });

  engineUnload() {
    this.searchEngineLoading = false;
    this.searchEngineLoadingTxt = '';
  }
  contractHireUnload() {
    this.contractHireLoading = false;
    this.contractHireLoadingTxt = '';
  }
  contractOwnerUnload() {
    this.contractOwnerLoading = false;
    this.contractOwnerLoadingTxt = '';
  }

  ceil10(int: number) {
    return (Math.ceil(int / 10) * 10);
  }

  protected calRemain(netPrice: number, interestPrice: number) {
    return parseFloat(netPrice.toString()) + parseFloat(interestPrice.toString());
  }

  protected calInteratePriceByMonth(netPrice: number, interest: number, instalmentEnd: number) {
    return (parseFloat(netPrice.toString()) * (parseFloat(interest.toString()) / 100)) * parseFloat(instalmentEnd.toString());
  }

  protected calInteratePriceByYear(netPrice: number, interest: number, instalmentEnd: number) {
    return (parseFloat(netPrice.toString()) * (parseFloat(interest.toString()) / 100)) * (parseFloat(instalmentEnd.toString()) * 12);
  }

  protected calInstalmentPrice(remain: number, instalmentEnd: number) {
    return parseFloat(remain.toString()) / parseFloat(instalmentEnd.toString());
  }

  protected instalmentPriceExtVat(instalmentPrice: number, vatPrice: number) {
    return parseFloat(instalmentPrice.toString()) - parseFloat(vatPrice.toString());
  }

  protected calVatPrice(instalmentPrice: number, nowVat: number) {
    nowVat = parseFloat(nowVat.toString());
    return (parseFloat(instalmentPrice.toString()) * nowVat) / (nowVat + 100);
  }

  protected calRate(instalmentEnd: number, instalmentPrice: number, netPrice: number) {
    return this.RATE(parseFloat(instalmentEnd.toString()), -(parseFloat(instalmentPrice.toString())), parseFloat(netPrice.toString())) * 100
  }

  protected calMrr(irr: number, instalmentEnd: number) {
    return parseFloat(irr.toString()) * parseFloat(instalmentEnd.toString());
  }

  private RATE(nper, pmt, pv, fv?, type?, guess?) {
    // Sets default values for missing parameters
    fv = typeof fv !== 'undefined' ? fv : 0;
    type = typeof type !== 'undefined' ? type : 0;
    guess = typeof guess !== 'undefined' ? guess : 0.1;

    // Sets the limits for possible guesses to any
    // number between 0% and 100%
    let lowLimit = 0;
    let highLimit = 1;

    // Defines a tolerance of up to +/- 0.00005% of pmt, to accept
    // the solution as valid.
    const tolerance = Math.abs(0.00000005 * pmt);

    // Tries at most 40 times to find a solution within the tolerance.
    for (let i = 0; i < 40; i++) {
      // Resets the balance to the original pv.
      let balance = pv;

      // Calculates the balance at the end of the loan, based
      // on loan conditions.
      for (let j = 0; j < nper; j++) {
        if (type === 0) {
          // Interests applied before payment
          balance = balance * (1 + guess) + pmt;
        } else {
          // Payments applied before insterests
          balance = (balance + pmt) * (1 + guess);
        }
      }

      // Returns the guess if balance is within tolerance.  If not, adjusts
      // the limits and starts with a new guess.
      if (Math.abs(balance + fv) < tolerance) {
        return guess;
      } else if (balance + fv > 0) {
        // Sets a new highLimit knowing that
        // the current guess was too big.
        highLimit = guess;
      } else {
        // Sets a new lowLimit knowing that
        // the current guess was too small.
        lowLimit = guess;
      }

      // Calculates the new guess.
      guess = (highLimit + lowLimit) / 2;
    }

    // Returns null if no acceptable result was found after 40 tries.
    return null;
  };
}