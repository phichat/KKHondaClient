import { ProductQuantity } from '../products/product-quantity';

export class ModelProduct {

    public typeId: number;
    public catId: number;
    public brandId: number;
    public modelId: number;
    public colorId: number;
    public quantity: Array<ProductQuantity>;
    public engineNo: string;
    public frameNo: string;
    public sellPrice: number;
    public sellPrice2: number;
    public sellVatPrice: number;
    public sellVat: number;
    public discountPrice: number;
    public discountVat: number;
    public sellNet: number;
    public freePrb: boolean;
    public freeRegister: boolean;
    public freeInsure: boolean;

};
