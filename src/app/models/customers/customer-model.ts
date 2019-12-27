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
  customerCode: string;
  addressType: string;
  address: string;
  amphorCode: string;
  provinceCode: string;
  zipcode: string;
  phone: string;
  fax: string;
  remarks: string;
  createBy: string;
  createDate?: Date;
  updateBy: string;
  updateDate?: Date;
}

export class MCustomerCard {
  customerCode: string;
  cardType: string;
  cardId: string;
  cardIssueDate?: Date;
  cardExpiryDate?: Date;
  cardLocation: string;
  cardPhoto: string;
  createBy: string;
  createDate?: Date;
  updateBy: string;
  updateDate?: Date;
}