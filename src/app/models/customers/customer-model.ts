export class CustomerModel {
  customerCode: string;
  customerPrename: string;
  customerName: string;
  customerSurname: string;
  customerNickname: string;
  customerLevel: string;
  customerPhone: string;
  customerEmail: string;
  customerSex: string;
  birthday: Date;
  nationality: string;
  occupation: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
  typePersonal: boolean;
  typeCorporate: boolean;
  typeDealer: boolean;
  typeSupplier: boolean;
  typeOther: boolean;
  typeFinance: boolean;
  idCard: string;
  createBy: string;
  createDate?: Date
  updateBy: string;
  updateDate?: Date
  mCustomerAddress: MCustomerAddress[];
  mCustomerCard: MCustomerCard[];
}

export class MCustomerAddress {

}

export class MCustomerCard {

}