import { ProductBranch } from '.';

export class MotobikeModel {
    public itemId: number;
    public typeId: number;
    public catId: number;
    public brandId: number;
    public modelId: number;
    public colorId: number;
    public branch: Array<ProductBranch>;
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
}
