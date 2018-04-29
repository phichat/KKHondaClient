export class Accessory {
    constructor(
        public typeId: number,
        public typeName: string,
        public brandId: number,
        public brandName: string,
        public modelId: number,
        public modelName: string,
        public itemAmnt: number,
        public costNet: number,
        public sellPrice: number,
        public discountPrice: number,
        public discount: number,
        public sellVatPrice: number,
        public sellVat: number,
        public sellNet: number
    ) {

    }
}